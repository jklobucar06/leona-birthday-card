import { useState } from "react";

type GalleryImageProps = {
  src: string;
  alt: string;
  className?: string;
};

// Parent keys this component by the selected image so its loading state resets.
const GalleryImage = ({ src, alt, className }: GalleryImageProps) => {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [attempt, setAttempt] = useState(0);

  return (
    <>
      {status === "loading" && (
        <span role="status" className="absolute inset-0 grid place-items-center text-center text-sm text-txt">
          Učitavam fotografiju…
        </span>
      )}
      {status === "error" ? (
        <div role="alert" className="grid min-h-48 place-content-center gap-3 p-6 text-center text-txt">
          <p>Fotografija se nije uspjela učitati.</p>
          <button type="button" className="rounded-full bg-white/90 px-4 py-2 cursor-pointer" onClick={() => {
            setStatus("loading");
            setAttempt(value => value + 1);
          }}>
            Pokušaj ponovno
          </button>
        </div>
      ) : (
        <img
          key={attempt}
          src={src}
          alt={alt}
          draggable={false}
          decoding="async"
          className={status === "loaded" ? className : className?.replace(/memory-image--(?:next|previous)/g, "")}
          style={status === "loaded" ? undefined : { opacity: 0 }}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      )}
    </>
  );
};

export default GalleryImage;
