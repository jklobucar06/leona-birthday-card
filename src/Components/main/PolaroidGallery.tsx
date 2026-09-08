import { X } from "lucide-react";
import { polaroids } from "../../data/polaroid-data"
import Container from "../elements/Container"
import { useEffect, useRef, useState } from "react"


const layouts = [
  {
    position: "-translate-x-2 lg:translate-y-5",
    rotation: "-rotate-6 hover:rotate-2",
  },
  {
    position: "translate-x-2 lg:translate-y-10",
    rotation: "rotate-5 hover:-rotate-2",
  },
  {
    position: "-translate-x-1 lg:-translate-y-3",
    rotation: "-rotate-3 hover:rotate-2",
  },
  {
    position: "translate-x-1 lg:translate-y-4",
    rotation: "rotate-6 hover:-rotate-2",
  },
  {
    position: "-translate-x-2 lg:translate-y-8",
    rotation: "-rotate-5 hover:rotate-2",
  },
  {
    position: "translate-x-2 lg:-translate-y-1",
    rotation: "rotate-6 hover:-rotate-2",
  },
];


const PolaroidGallery = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const selectedPhoto = selectedIndex !== null ? polaroids[selectedIndex] : null;

  const [isPhotoClosing, setIsPhotoClosing] = useState(false);

  const closePhoto = () => {
    if(isPhotoClosing) return;

    setIsPhotoClosing(true);

    window.setTimeout(() => {
      setSelectedIndex(null);
      setIsPhotoClosing(false);
    }, 240);
  }

  useEffect(() => {
    if(selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    document.body.style.overflow = "hidden";

    const animationFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if(event.key === "Escape") setSelectedIndex(null);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedElement?.focus();
    };


  }, [selectedIndex])

  return (
    <section className="overflow-hidden px-3 py-16 ms:px-6 lg:py-24">
        <Container>
            <div className="mb-14 text-center sm:mb-16">
              <h1 className="mt-3 text-4xl font-thin text-txt sm:text-6xl lg:text-7xl text-shadow-xs">
                Naše uspomene ♡
              </h1>
            </div>

            <ul className="grid w-full grid-cols-1 justify-items-center gap-x-8 gap-y-16 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-14" aria-label="Naše fotografije">
              {polaroids.map((polaroid, index) => {
                const layout = layouts[index % layouts.length];
                return (
                  <li key={polaroid.number} className={`w-full max-w-67.5 ${layout.position}`}>
                    <button
                      type="button"
                      className={`
                      group relative block w-full cursor-zoom-in bg-[#fffdf8] p-3 pb-0 text-txt shadow-md trasition duration-300 ease-out hover:z-10 hover:scale-105 outline-none hover:shadow-lg active:scale-[1.02] ${layout.rotation}`}
                      onClick={() => setSelectedIndex(index)}
                    >
                      <span
                        className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3 bg-[#ead5c5]/80"/>

                      <span className="relative block aspect-square overflow-hidden bg-primary-dark/20">
                        <img src={polaroid.src} alt={`Photo ${index + 1}`} className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
                        loading="lazy"/>

                        <span className="absolute right-2 bottom-2 grid size-8 place-items-center rounded-full bg-white/75 text-lg text-txt/70 opacity-0 shadow-sm transition duration-200 ease-linear group-hover:opacity-100 hover:scale-105 hover:bg-white/85 active:scale-95 border-none group-focus-visible:opacity-100 cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-maximize2-icon lucide-maximize-2"><path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M9 21H3v-6"/></svg>
                        </span>
                      </span>

                      <span className="flex min-h-20 items-center justify-center gap-3 px-2 py-4 font-handwritten">
                        <span className="shirnk-0 text-2xl text-txt/60 font-bold sm:text-3xl">
                          {polaroid.number}
                        </span>

                        <span className="text-xl font-semibold leading-none sm:text-2xl" >
                          {polaroid.title}
                        </span>
                      </span>

                    </button>
                  </li>
                )
              })}
            </ul>

            <p className="mt-20 text-center uppercase tracking-widest text-lg md:text-xl text-txt/60">
              nastavit će se...😛
            </p>
        </Container>

        {selectedPhoto && (
          <div
            className={`
              photo-lightbox
              fixed inset-0 z-50
              grid place-items-center
              overflow-y-auto
              bg-[#2e1b2b]/85
              p-5 backdrop-blur-md
              ${
                isPhotoClosing
                  ? "photo-lightbox--closing"
                  : "photo-lightbox--opening"
              }
            `}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closePhoto();
              }
            }}
          >
            <button ref={closeButtonRef} type="button" className="fixed top-4 right-4 grid size-12 place-items-center rounded-full border border-white/30 bg-white/15 text-3xl outline-none text-white transition duration-300 hover:bg-white/30 active:scale-98" onClick={closePhoto} aria-label="Zatvori fotografiju">
              <X strokeWidth={1.5} />
            </button>

            <figure className="photo-lightbox__card m-0 w-fit max-w-full bg-[#fffdf8] p-3 pb-0 shadow-xl animate-[photoIn-300ms_cubic-bezier(0.22,1,0.36,1)_both] sm:p-4 sm:pb-0">
              <img src={selectedPhoto.src} alt={`Uspomena ${selectedPhoto.number}: ${selectedPhoto.title}`} className="block max-h-[70dvh] max-w-full object-contain"/>

              <figcaption className="flex min-h-20 items-center justify-center gap-3 px-3 py-4">
                <span className="text-xl text-txt font-bold sm:text-2xl">
                  {selectedPhoto.number}
                </span>
                <span className="text-2xl sm:text-3xl text-txt">
                  {selectedPhoto.title}
                </span>
              </figcaption>
            </figure>
          </div>
        )}
    </section>
  )
}

export default PolaroidGallery
