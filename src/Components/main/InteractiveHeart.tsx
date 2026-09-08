import { useState, useRef, useEffect, useCallback, type CSSProperties } from "react";
import Container from "../elements/Container";
import { Heart, X } from "lucide-react";

const REQUIRED_CLICKS = 8;
const FINAL_PHOTO = "/gallery/leona_na_krevetu-final.jpeg";
const BIRTHDAY_MESSAGE = " SRETAN ROĐENDAN LEONISHU MOJ NAJDRAŽI ★".repeat(3);

interface Position {
  x: number;
  y: number;
}

const InteractiveHeart = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isBursting, setIsBursting] = useState(false);
  const [isFinalOpen, setIsFinalOpen] = useState(false);
  const [isFinalClosing, setIsFinalClosing] = useState(false);

  const [viewport, setViewport] = useState({width: 1000, height: 700});

  const heartStageRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const birthdayBorderRef = useRef<SVGSVGElement>(null);

  const burstTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const pointerFrameRef = useRef<number | null>(null);
  const pointerPositionRef = useRef<Position>({x: 0, y: 0});
  const heartCenterRef = useRef<Position>({x: 0, y: 0});

  const progress = clickCount / REQUIRED_CLICKS;

  const heartScale = 1 + progress * 4.5;

  const applyMagnetOffset = useCallback((x: number, y: number) => {
    const heartStage = heartStageRef.current;

    if(!heartStage) return;

    heartStage.style.setProperty("--heart-x", `${x}px`);
    heartStage.style.setProperty("--heart-y", `${y}px`);
    heartStage.style.setProperty("--glow-x", `${x * 1.6}px`);
    heartStage.style.setProperty("--glow-y", `${y * 1.6}px`);
  }, []);

  const measureHeartCenter = () => {
    const heartStage = heartStageRef.current;

    if(!heartStage) return;

    const heartRect = heartStage.getBoundingClientRect();

    heartCenterRef.current = {
      x: heartRect.left + heartRect.width / 2,
      y: heartRect.top + heartRect.height / 2,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if(event.pointerType === "touch") return;

    pointerPositionRef.current = {x: event.clientX, y: event.clientY};

    if(pointerFrameRef.current !== null) return;

    pointerFrameRef.current = window.requestAnimationFrame(() => {
      pointerFrameRef.current = null;

      const differenceX = pointerPositionRef.current.x - heartCenterRef.current.x;
      const differenceY = pointerPositionRef.current.y - heartCenterRef.current.y;
      const distance = Math.hypot(differenceX, differenceY);

      if(distance === 0) {
        applyMagnetOffset(0, 0);
        return;
      }

      const movement = Math.min(distance * 0.12, 18);

      applyMagnetOffset(
        (differenceX / distance) * movement,
        (differenceY / distance) * movement,
      );
    });
  };

  const handleHeartClick = () => {
    if(isBursting || isFinalOpen) return;

    const nextCount = Math.min(clickCount + 1, REQUIRED_CLICKS);

    setClickCount(nextCount);

    if(nextCount < REQUIRED_CLICKS) return;

    setIsBursting(true);

    burstTimerRef.current = window.setTimeout(() => {
      setIsBursting(false);
      setIsFinalOpen(true);
    }, 550);
  };

  const closeFinalMessage = useCallback(() => {
      if(closeTimerRef.current !== null) return;

      setIsFinalClosing(true);

      closeTimerRef.current = window.setTimeout(() => {
        setIsFinalOpen(false);
        setIsFinalClosing(false);
        setClickCount(0);
        applyMagnetOffset(0, 0);

        closeTimerRef.current = null;
      }, 300);

    }, [applyMagnetOffset]);

    useEffect(() => {
      if(!isFinalOpen) return;

      const previousOverflow = document.body.style.overflow;

      const previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

      document.body.style.overflow = "hidden";

      const updateViewport = () => {
        setViewport({width: window.innerWidth, height: window.innerHeight});
      };

      updateViewport();
      window.addEventListener("resize", updateViewport);

      const animationFrame = window.requestAnimationFrame(() => {
        closeButtonRef.current?.focus();

        const birthdayBorder = birthdayBorderRef.current;

        if(!birthdayBorder) return;

        birthdayBorder.setCurrentTime(0);
        birthdayBorder
          .querySelectorAll<SVGAnimationElement>("animate")
          .forEach(animation => animation.beginElement());
      });

      const handleKeyDown = (event: KeyboardEvent) => {
        if(event.key === "Escape") {
          closeFinalMessage();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.cancelAnimationFrame(animationFrame);
        window.removeEventListener("resize", updateViewport);

        window.removeEventListener("keydown", handleKeyDown);

        document.body.style.overflow = previousOverflow;
        previouslyFocusedElement?.focus();
      };
    }, [isFinalOpen, closeFinalMessage]);

    useEffect(() => {
      return() => {
        if(burstTimerRef.current !== null) window.clearTimeout(burstTimerRef.current);

        if(closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);

        if(pointerFrameRef.current !== null) window.cancelAnimationFrame(pointerFrameRef.current);
      }
    }, []);

    const borderInset = Math.max(
      48,
      Math.min(84, Math.min(viewport.width, viewport.height) * 0.075),
    );

    const borderRadius = Math.max(22, Math.min(viewport.width, viewport.height) * 0.045);

    const borderPathLength =
      2 * (viewport.width - borderInset * 2) +
      2 * (viewport.height - borderInset * 2) +
      (2 * Math.PI - 8) * borderRadius;

    const borderPath = `
        M ${borderInset + borderRadius} ${borderInset}
        H ${viewport.width - borderInset - borderRadius}
        Q ${viewport.width - borderInset} ${borderInset}
          ${viewport.width - borderInset} ${borderInset + borderRadius}

        V ${viewport.height - borderInset - borderRadius}
        Q ${viewport.width - borderInset} ${viewport.height - borderInset}
          ${viewport.width - borderInset - borderRadius} ${viewport.height - borderInset}

        H ${borderInset + borderRadius}
        Q ${borderInset} ${viewport.height - borderInset}
          ${borderInset} ${viewport.height - borderInset - borderRadius}

        V ${borderInset + borderRadius}
        Q ${borderInset} ${borderInset}
          ${borderInset + borderRadius} ${borderInset}

        Z
      `;
  return (
    <section className="relative flex min-h-[90vh] w-full items-center overflow-visible px-4 py-24" onPointerEnter={measureHeartCenter} onPointerMove={handlePointerMove} onPointerLeave={() => applyMagnetOffset(0, 0)}>
      <Container>
        <header className="mb-20 text-center">
          <p className="text-sm text-txt/60">
            I za kraj...
          </p>

          <h2 className="mt-3 text-5xl font-semibold text-txt sm:text-6xl">
            Ispuni srce ♡
          </h2>
        </header>

        <div className="relative z-20 grid place-items-center">
          <div
            ref={heartStageRef}
            className="interactive-heart__stage relative grid size-32 place-items-center"
            style={{
              "--heart-scale": heartScale,
              "--glow-scale": heartScale * 1.2,
            } as CSSProperties}
          >
            {/* Glow je kopija oblika srca, a ne okrugli div */}
            <span
              aria-hidden="true"
              className="interactive-heart__glow-wrapper pointer-events-none absolute left-1/2 top-1/2 block size-16"
            >
              <Heart
                className="interactive-heart__glow h-full w-full fill-red-500 text-red-500"
                strokeWidth={1.5}
              />
            </span>

            {/* Stvarno interaktivno srce */}
            <button
              type="button"
              className="interactive-heart__button relative z-10 grid size-20 cursor-pointer place-items-center bg-transparent disabled:cursor-default"
              onClick={handleHeartClick}
              disabled={isBursting}
              aria-label={`Ispuni srce, ${clickCount} od ${REQUIRED_CLICKS}`}
              aria-valuemin={0}
              aria-valuemax={REQUIRED_CLICKS}
              aria-valuenow={clickCount}
            >
              <span
                className={`interactive-heart__visual relative block size-16 ${
                  isBursting
                    ? "interactive-heart__visual--bursting"
                    : ""
                }`}
              >
                <Heart
                  className="absolute inset-0 h-full w-full text-red-700"
                  strokeWidth={1.5}
                />

                <span
                  className="absolute inset-0 transition-[clip-path] duration-300 ease-out"
                  style={{
                    clipPath: `inset(${100 - progress * 100}% 0 0 0)`,
                  }}
                >
                  <Heart
                    className="h-full w-full fill-red-700 text-red-700"
                    strokeWidth={1.5}
                  />
                </span>
              </span>
            </button>
          </div>

          <p className="mt-10 text-sm tracking-widest text-txt/55">
            {clickCount} / {REQUIRED_CLICKS}
          </p>
        </div>
      </Container>

      {isFinalOpen && (
        <div
          className={`birthday-final fixed inset-0 z-100 flex min-h-dvh items-center justify-center overflow-hidden px-8 py-20 ${
            isFinalClosing
              ? "birthday-final--closing"
              : "birthday-final--opening"
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="birthday-final-heading"
        >
          <h2 id="birthday-final-heading" className="sr-only">
            Sretan rođendan Leonishu moj najdraži
          </h2>

          <svg
            ref={birthdayBorderRef}
            aria-hidden="true"
            className="birthday-final__border pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${viewport.width} ${viewport.height}`}
          >
            <defs>
              <path
                id="birthday-border-path"
                d={borderPath}
                pathLength="100"
                fill="none"
              />
            </defs>

            {/* Glavni casino tekst */}
            <text className="birthday-final__border-text birthday-final__border-text--base">
              <textPath href="#birthday-border-path" startOffset="0%" textLength={borderPathLength} lengthAdjust="spacing">
                {BIRTHDAY_MESSAGE}

                <animate
                  attributeName="startOffset"
                  from="0%"
                  to="100%"
                  begin="indefinite"
                  dur="30s"
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              </textPath>
            </text>

            <text className="birthday-final__border-text birthday-final__border-text--base">
              <textPath href="#birthday-border-path" startOffset="-100%" textLength={borderPathLength} lengthAdjust="spacing">
                {BIRTHDAY_MESSAGE}

                <animate
                  attributeName="startOffset"
                  from="-100%"
                  to="0%"
                  begin="indefinite"
                  dur="30s"
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              </textPath>
            </text>

            {/* Svijetle točkice koje glume žaruljice */}
            <text className="birthday-final__border-text birthday-final__border-text--bulbs">
              <textPath href="#birthday-border-path" startOffset="0%" textLength={borderPathLength} lengthAdjust="spacing">
                {BIRTHDAY_MESSAGE}

                <animate
                  attributeName="startOffset"
                  from="0%"
                  to="100%"
                  begin="indefinite"
                  dur="30s"
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              </textPath>
            </text>

            <text className="birthday-final__border-text birthday-final__border-text--bulbs">
              <textPath href="#birthday-border-path" startOffset="-100%" textLength={borderPathLength} lengthAdjust="spacing">
                {BIRTHDAY_MESSAGE}

                <animate
                  attributeName="startOffset"
                  from="-100%"
                  to="0%"
                  begin="indefinite"
                  dur="30s"
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              </textPath>
            </text>
          </svg>

          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Zatvori rođendansku poruku"
            className="fixed right-5 top-5 z-30 grid size-12 place-items-center rounded-full border border-amber-950/30 bg-amber-50/70 text-amber-950 shadow-lg backdrop-blur-md transition duration-200 hover:scale-105 hover:bg-white"
            onClick={closeFinalMessage}
          >
            <X size={26} />
          </button>

          <figure className="birthday-final__content relative z-10 m-0 flex max-h-[78dvh] max-w-[min(76vw,720px)] flex-col items-center">
            <img
              src={FINAL_PHOTO}
              alt="Leona"
              width="1370"
              height="1600"
              decoding="async"
              className="block max-h-[56dvh] max-w-full rounded-3xl object-contain shadow-2xl"
            />
            

            <figcaption className="mt-6 bg-linear-to-r from-transparent via-white/65 to-transparent text-center font-light text-amber-700 text-shadow-xs md:text-2xl">
              Neka ti ovaj dan bude puno bolji od svih prethodnih i
              malo lošiji od svih sljedećih!
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  )
}

export default InteractiveHeart
