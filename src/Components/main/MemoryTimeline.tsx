import { useState, useEffect, useRef, useCallback } from "react"
import { timelineMemories } from "../../data/timeline-data";
import Container from "../elements/Container";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { getThumbnail, preloadImage } from "../../utils/images";
import GalleryImage from "../elements/GalleryImage";

const DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000;

const parseTimelineDate = (date: string) => {
  const [day, month, year] = date.replace(/\.$/, "").split(".").map(Number)

  return Date.UTC(year, month - 1, day);
};

const timelineStart = parseTimelineDate(timelineMemories[0].date);

const timelineEnd = parseTimelineDate(timelineMemories[timelineMemories.length - 1].date);

const getTimelinePosition = (date: string) => {
  const dateTimestamp = parseTimelineDate(date);
  const daysFromStart = (dateTimestamp - timelineStart) / DAY_IN_MILISECONDS;

  const totalDays = (timelineEnd - timelineStart) / DAY_IN_MILISECONDS;

  return (daysFromStart / totalDays) * 100;
}

type MarkerPlacement = {
  side: "top" | "bottom";
  distance: "near" | "far";
};

const markerPlacements: MarkerPlacement[] = [
  { side: "top", distance: "near" },    // 2.4.
  { side: "bottom", distance: "near" }, // 3.5.
  { side: "top", distance: "near" },    // 23.5.
  { side: "bottom", distance: "near" }, // 6.7.
  { side: "top", distance: "near" },    // 13.7.
  { side: "top", distance: "far" },     // 17.8.
  { side: "bottom", distance: "near" }, // 22.8.
  { side: "top", distance: "near" },    // 29.8.
  { side: "bottom", distance: "far" },  // 9.9.
  { side: "top", distance: "far" },     // 20.9.
  { side: "bottom", distance: "near" }, // 26.9.
];

const MemoryTimeline = () => {
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState<number | null>(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  type SlideDirection = "next" | "previous";
  const [slideDirection, setSlideDirection] = useState<SlideDirection>("next");

  const [isGalleryClosing, setIsGalleryClosing] = useState(false);

  const selectedMemory = selectedMemoryIndex !== null ? timelineMemories[selectedMemoryIndex] : null;

  const selectedImage = selectedMemory?.images[selectedImageIndex] ?? null;

  const closeTimerRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const preloadMemory = (memoryIndex: number) => {
    timelineMemories[memoryIndex].images.forEach(({ src }) => preloadImage(src));
  };

  const openGallery = (memoryIndex: number) => {
    setSelectedImageIndex(0);
    setSlideDirection("next");
    setSelectedMemoryIndex(memoryIndex);
  };

  const closeGallery = useCallback(() => {
    if(closeTimerRef.current !== null) return;
    setIsGalleryClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setSelectedMemoryIndex(null);
      setSelectedImageIndex(0);
      setIsGalleryClosing(false);
      closeTimerRef.current = null;
    }, 240);
  }, []);

  const changeImage = useCallback((direction: SlideDirection) => {
    if(!selectedMemory || closeTimerRef.current !== null) return;
    setSlideDirection(direction);
    setSelectedImageIndex(index => (
      index + (direction === "next" ? 1 : -1) + selectedMemory.images.length
    ) % selectedMemory.images.length);
  }, [selectedMemory]);

  const showPreviousImage = () => changeImage("previous");
  const showNextImage = () => changeImage("next");

  useEffect(() => {
    if(!selectedMemory || selectedMemory.images.length < 2) return;
    const nextIndex = (selectedImageIndex + 1) % selectedMemory.images.length;
    preloadImage(selectedMemory.images[nextIndex].src);
  }, [selectedMemory, selectedImageIndex]);

  useEffect(() => () => {
    if(closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    if(selectedMemoryIndex === null) return;

    const selectedMemory = timelineMemories[selectedMemoryIndex];

    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    document.body.style.overflow = "hidden";

    const animationFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if(event.key === "Escape") {
        event.preventDefault();
        closeGallery();
      }

      if(event.key === "ArrowLeft" && selectedMemory.images.length > 1) {
        event.preventDefault();
        changeImage("previous");
      }

      if(event.key === "ArrowRight" && selectedMemory.images.length > 1) {
        event.preventDefault();
        changeImage("next");
      }
    }

    window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.cancelAnimationFrame(animationFrame);
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = previousOverflow;
        previouslyFocusedElement?.focus();
      };
  }, [selectedMemoryIndex, closeGallery, changeImage])
  

  return (
    <section className="overflow-hidden bg-white/20 px-3 py-20 text-txt sm:px-6 lg:py-28">
      <Container>
        <header>
          <p className="text-xs tracking-[0.3rem] text-txt/55">
            2.4.2026. - 26.9.2026.
          </p>

          <h2 className="mt-3  text-5xl font-semibold sm:text-6xl lg:text-7xl">
            Jaako dugačak timelineeeee...
          </h2>

          <p className="mt-2 text-xl text-txt/55">
            Zaviri u ovo kratko, ali predivno razdoblje!
          </p>
        </header>

        <div className="timeline-scrollbar w-full overflow-x-auto pb-8">
          <div className="relative h-144 min-w-[1600px]">
            <div className="absolute inset-y-0 right-20 left-20">
              <div
                className="
                  absolute top-1/2 right-0 left-0
                  h-1 -translate-y-1/2
                  rounded-full
                  bg-linear-to-r
                  from-primary-dark/35
                  via-primary-dark
                  to-primary-dark/35
                "
                aria-hidden="true"
              />

              <ol className="absolute inset-0">
                {timelineMemories.map((memory, memoryIndex) => {
                  const coverImage = memory.images[0];

                  const position = getTimelinePosition(
                    memory.date,
                  );

                  const placement =
                    markerPlacements[
                      memoryIndex % markerPlacements.length
                    ];

                  const connectorHeight =
                    placement.distance === "far"
                      ? "h-32"
                      : "h-8";

                  const coverButton = (
                    <button
                      type="button"
                      className="
                        group relative z-10
                        size-24 shrink-0
                        cursor-pointer overflow-hidden
                        rounded-full border-4 border-white
                        bg-primary-dark/25 shadow-md
                        transition duration-300 ease-out
                        hover:scale-110 focus:outline-none 
                        focus-visible:outline-none
                      "
                      onMouseEnter={() => preloadMemory(memoryIndex)}
                      onFocus={() => preloadMemory(memoryIndex)}
                      onClick={() => openGallery(memoryIndex)}
                      aria-haspopup="dialog"
                      aria-label={`Otvori uspomene za datum ${memory.date}`}
                    >
                      <img
                        src={getThumbnail(coverImage.src)}
                        alt={`Naslovna uspomena za ${memory.date}`}
                        className="
                          h-full w-full object-cover
                          transition duration-500
                          group-hover:scale-110
                          group-focus-visible:scale-110
                        "
                        loading="lazy"
                        decoding="async"
                      />

                      <span
                        className="
                          absolute inset-0
                          grid place-items-center
                          bg-txt/65 px-3
                          text-center text-xs
                          font-medium text-white
                          opacity-0
                          backdrop-blur-[1px]
                          transition duration-300
                          group-hover:opacity-100
                          group-focus-visible:opacity-100
                        "
                      >
                        Vidi uspomene...
                      </span>
                    </button>
                  );

                  const dateLabel = (
                    <time
                      className="
                        rounded-full bg-white/65
                        px-3 py-1.5
                        text-sm font-light
                        tracking-wider whitespace-nowrap
                        text-txt/70 shadow-sm
                      "
                    >
                      {memory.date}
                    </time>
                  );

                  return (
                    <li
                      key={memory.date}
                      className="
                        absolute top-1/2
                        -translate-x-1/2
                        -translate-y-1/2
                      "
                      style={{ left: `${position}%` }}
                    >
                      <span
                        className="
                          relative z-20 block
                          size-4 rounded-full
                          border-3 border-white
                          bg-primary-dark
                          shadow-[0_0_0_4px_rgba(232,174,198,0.35)]
                        "
                        aria-hidden="true"
                      />

                      {placement.side === "top" ? (
                        <div
                          className="
                            absolute bottom-2 left-1/2
                            flex -translate-x-1/2
                            flex-col items-center gap-2
                          "
                        >
                          {coverButton}

                          {dateLabel}

                          <span
                            className={`
                              w-0.5 bg-primary-dark/55
                              ${connectorHeight}
                            `}
                            aria-hidden="true"
                          />
                        </div>
                      ) : (
                        <div
                          className="
                            absolute top-2 left-1/2
                            flex -translate-x-1/2
                            flex-col items-center gap-2
                          "
                        >
                          <span
                            className={`
                              w-0.5 bg-primary-dark/55
                              ${connectorHeight}
                            `}
                            aria-hidden="true"
                          />

                          {dateLabel}

                          {coverButton}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </Container>

      {selectedMemory && selectedImage && (
       <div
          className={`
            memory-gallery
            fixed inset-0 z-50
            flex min-h-dvh items-center justify-center
            overflow-y-auto
            bg-[#a38686]/55
            px-3 py-16
            backdrop-blur-lg
            sm:px-8
            ${
              isGalleryClosing
                ? "memory-gallery--closing"
                : "memory-gallery--opening"
            }
          `}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeGallery();
            }
          }}
        >
          <div className="memory-gallery__content w-fit max-w-full">
            <header className="mb-4 text-center text-white">
              <h3 className="text-3xl font-semibold sm:text-4xl text-shadow-lg" >
                {selectedMemory.date}
              </h3>
              
              <p className="mt-1 text-xs tracking-widest text-white/55">
                {selectedImageIndex + 1} / {selectedMemory.images.length}
              </p>
            </header>

            <button ref={closeButtonRef} type="button" className="fixed top-4 right-4 z-20 grid size-12 place-items-center rounded-full border border-white/25 bg-white/10 text-white cursor-pointer backdrop-blur-sm transition duration-300 hover:bg-white/25" onClick={closeGallery}>
              <X size={25} aria-hidden="true" />
            </button>

            <figure className="m-0 w-fit max-w-full">
              <div
                className="relative mx-auto flex h-[68dvh] w-[min(92vw,1100px)] max-w-full touch-pan-y items-center justify-center"
                onTouchStart={(event) => {
                  touchStartRef.current = event.touches.length === 1
                    ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
                    : null;
                }}
                onTouchCancel={() => { touchStartRef.current = null; }}
                onTouchEnd={(event) => {
                  const start = touchStartRef.current;
                  touchStartRef.current = null;
                  if(!start || !event.changedTouches[0]) return;
                  const dx = event.changedTouches[0].clientX - start.x;
                  const dy = event.changedTouches[0].clientY - start.y;
                  if(Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                    changeImage(dx < 0 ? "next" : "previous");
                  }
                }}
              >
                <GalleryImage key={`${selectedMemoryIndex}-${selectedImageIndex}`} src={selectedImage.src} alt={`photo ${selectedImageIndex + 1}`} className={`h-full w-full object-contain rounded-md ${
                  slideDirection === "next"
                  ? "memory-image--next"
                  : "memory-image--previous"
                }`} />
                {selectedMemory.images.length > 1 && (
                  <>
                    <button type="button" className="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/25  bg-primary-dark/35 text-white backdrop-blur-sm transition duration-300 hover:scale-110 hover:bg-primary-dark/35 cursor-pointer active:scale-95 sm:left-4 sm:size-14" onClick={showPreviousImage}>
                      <ChevronLeft strokeWidth={1.5} size={30} />
                    </button>
                    <button type="button" className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-primary-dark/35 text-white backdrop-blur-sm transition duration-300 hover:scale-110 hover:bg-primary-dark/35 cursor-pointer active:scale-95 sm:right-4 sm:size-14" onClick={showNextImage}>
                      <ChevronRight strokeWidth={1.5} size={30} />
                    </button>
                  </>
                )}
              </div>
              <figcaption key={`caption-${selectedImageIndex}`} className="memory-caption mx-auto mt-3 max-w-3xl bg-linear-to-r from-transparent via-primary-dark/85 to-transparent px-10 py-4 text-center text-sm leading-relaxed text-white text-shadow-md sm:px-20 sm:text-base">
                {selectedImage.caption}
              </figcaption>
            </figure>
          </div>
        </div>
      )}

    </section>
  )
}

export default MemoryTimeline