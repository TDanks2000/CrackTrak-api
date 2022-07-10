export const minifyImageSrc = (src) => {
  if (!src) return src;

  const split = src.split("/media/");
  return `${split[0]}/media/crop/600/400/${split[1]}`;
};
