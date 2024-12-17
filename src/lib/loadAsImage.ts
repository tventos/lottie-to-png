export const loadAsImage = (
  markup: string,
  width: number,
  height: number,
): Promise<HTMLImageElement> => {
  const img = new Image();
  return new Promise((res, rej) => {
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(markup);
    img.width = width;
    img.height = height;
  });
};
