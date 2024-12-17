export const scaleImage = (source: HTMLImageElement, scaleFactor: number) => {
  const canvasElement = document.createElement("canvas");
  const context = canvasElement.getContext("2d")!;
  const width = source.width * 10 * scaleFactor;
  const height = source.height * 10 * scaleFactor;
  canvasElement.width = width;
  canvasElement.height = height;

  context.drawImage(source, 0, 0, width, height);

  return canvasElement;
};
