import { useState, useEffect, useRef } from "react"
import { timelineMemories } from "../../data/timeline-data";
import Container from "../elements/Container";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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
  {side: "top", distance: "near"},
  {side: "bottom", distance: "near"},
  {side: "top", distance: "near"},
  {side: "bottom", distance: "near"},
  {side: "top", distance: "near"},
  {side: "top", distance: "far"},
  {side: "bottom", distance: "near"},
  {side: "top", distance: "near"},
]

const MemoryTimeline = () => {
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState<number | null>(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  type SlideDirection = "next" | "previous";
  const [slideDirection, setSlideDirection] = useState<SlideDirection>("next");

  const [isGalleryClosing, setIsGalleryClosing] = useState(false);

  const selectedMemory = selectedMemoryIndex !== null ? timelineMemories[selectedMemoryIndex] : null;

  const selectedImage = selectedMemory?.images[selectedImageIndex] ?? null;

  const openGallery = (memoryIndex: number) => {
    setSelectedImageIndex(0);
    setSelectedMemoryIndex(memoryIndex);
  }

  const closeGallery = () => {
    if(isGalleryClosing) return;

    setIsGalleryClosing(true);

    window.setTimeout(() => {
      setSelectedMemoryIndex(null);
      setSelectedImageIndex(0);
      setIsGalleryClosing(false);
    }, 240);
  }

  const showPreviousImage = () => {
    if(!selectedMemory) return;

    setSlideDirection("previous");

    setSelectedImageIndex(idx => idx > 0 ? idx - 1 : selectedMemory.images.length - 1);
  }

  const showNextImage = () => {
    if(!selectedMemory) return;

    setSlideDirection("next");

    setSelectedImageIndex(idx => idx === (selectedMemory.images.length - 1) ? 0 : idx + 1);
  }

  useEffect(() => {
    if(selectedMemoryIndex === null) return;

    const selectedMemory = timelineMemories[selectedMemoryIndex];

    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    document.body.style.overflow = "hidden";

    const animationFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if(event.key === "Escape") {
        setSelectedImageIndex(0);
        setSelectedMemoryIndex(null);
      }

      if(event.key === "ArrowLeft" && selectedMemory.images.length > 1) {
        setSelectedImageIndex(curr => curr !== 0 ? curr - 1: selectedMemory.images.length - 1);
      }

      if(event.key === "ArrowRight" && selectedMemory.images.length > 1) {
        setSelectedImageIndex(curr => curr === (selectedMemory.images.length - 1) ? 0 : curr + 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.cancelAnimationFrame(animationFrame);
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = previousOverflow;
        previouslyFocusedElement?.focus();
      };
  }, [selectedMemoryIndex])
  

  return (
    <section className="overflow-hidden bg-white/20 px-3 py-20 text-txt sm:px-6 lg:py-28">
      <Container>
        <header>
          <p className="text-xs tracking-[0.3rem] text-txt/55">
            2.4.2026. - 29.8.2026.
          </p>

          <h2 className="mt-3  text-5xl font-semibold sm:text-6xl lg:text-7xl">
            Jaako dugačak timelineeeee...
          </h2>

          <p className="mt-2 text-xl text-txt/55">
            Zaviri u ovo kratko, ali predivno razdoblje!
          </p>
        </header>

        <div className="timeline-scrollbar w-full overflow-x-auto pb-8">
          <div className="relative h-144 min-w-7xl">
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
                        hover:scale-110
                        focus-visible:scale-110
                        focus-visible:outline-3
                        focus-visible:outline-offset-4
                        focus-visible:outline-primary-dark
                      "
                      onClick={() =>
                        openGallery(memoryIndex)
                      }
                      aria-haspopup="dialog"
                      aria-label={`Otvori uspomene za datum ${memory.date}`}
                    >
                      <img
                        src={coverImage.src}
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
              <div className="relative mx-auto flex h-[68dvh] w-[min(92vw, 1100px)] items-center justify-center">
                <img key={`${selectedMemoryIndex}-${selectedImageIndex}`} src={selectedImage.src} alt={`photo ${selectedImageIndex + 1}`} className={`h-full w-full object-contain rounded-md ${
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