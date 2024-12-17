export const canvasToBlobAsync = async (
  canvasElement: HTMLCanvasElement,
): Promise<Blob | null> => {
  return new Promise((resolve, reject) => {
    canvasElement.toBlob((blob) => {
      if (!blob) {
        reject("No blob data");
      }

      resolve(blob);
    }, "image/png");
  });
};
