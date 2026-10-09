import thumbnailNames from "../data/thumbnail-files.json";

const thumbnails = new Set(thumbnailNames);
const preloadedImages = new Map<string, HTMLImageElement>();

export const getThumbnail = (src: string) => {
  const filename = src.slice(src.lastIndexOf("/") + 1);
  return thumbnails.has(filename)
    ? `${import.meta.env.BASE_URL}gallery/thumbnails/${filename}`
    : src;
};

export const preloadImage = (src: string) => {
  if(preloadedImages.has(src)) return;
  const image = new Image();
  preloadedImages.set(src, image);
  image.fetchPriority = "low";
  image.onerror = () => { preloadedImages.delete(src); };
  image.src = src;
};
