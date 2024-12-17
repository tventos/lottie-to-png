import { FC, useEffect, useRef, useState } from "react";
import lottie, { AnimationItem } from "lottie-web";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { loadAsImage } from "./lib/loadAsImage";
import { scaleImage } from "./lib/scaleImage";
import { generateFrameName } from "./lib/generateFrameName";

import cn from "./Step2.module.scss";
import { canvasToBlobAsync } from "./lib/canvasToBlobAsync.ts";

const DEFAULT_FRAMES_LENGTH = 60;
const DEFAULT_ANIMATION_WIDTH = 400;
const DEFAULT_ANIMATION_HEIGHT = 400;
const SCALE_FACTOR = 0.2;

interface Props {
  lottieData: string;
  fileName: string;
  onReset: VoidFunction;
}

export const Step2: FC<Props> = ({ lottieData, onReset, fileName }) => {
  const [lessFrames, setLessFrames] = useState(DEFAULT_FRAMES_LENGTH);
  const [width, setWidth] = useState(DEFAULT_ANIMATION_WIDTH);
  const [height, setHeight] = useState(DEFAULT_ANIMATION_HEIGHT);

  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<AnimationItem | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!lottieContainerRef.current) {
      return;
    }

    const width = parseInt(fileName.split(".")[1]);

    if (!isNaN(width)) {
      setWidth(width);
      setHeight(width);
    }

    lottieRef.current = lottie.loadAnimation({
      container: lottieContainerRef.current,
      autoplay: false,
      loop: false,
      renderer: "svg",
      animationData: JSON.parse(lottieData),
    });

    const totalFrames = lottieRef.current.totalFrames;

    if (totalFrames < DEFAULT_FRAMES_LENGTH) {
      setLessFrames(totalFrames);
    }

    console.log("[lottie info] totalFrames:", totalFrames);
  }, [fileName, lottieData]);

  useEffect(() => {
    if (!lottieRef.current) {
      return;
    }

    if (lottieRef.current.totalFrames < lessFrames) {
      setLessFrames(lottieRef.current.totalFrames);
    }
  }, [lessFrames]);

  const download = async () => {
    if (
      !lottieRef.current ||
      !lottieContainerRef.current ||
      !canvasRef.current
    ) {
      return;
    }

    const totalFrames = lottieRef.current?.totalFrames;
    const canvasElement = canvasRef.current;
    const lottieContainer = lottieContainerRef.current;

    const zip = new JSZip();
    const images = zip.folder(fileName);

    const frameInterval = Math.floor(
      lottieRef.current.totalFrames / lessFrames,
    );

    let frameCursor = 0;

    const canvasElement2dContext = canvasElement.getContext("2d")!;
    canvasElement2dContext.imageSmoothingEnabled = false;

    try {
      for (let currentFrame = 0; currentFrame <= totalFrames; currentFrame++) {
        if (currentFrame % frameInterval !== 0) {
          continue;
        }

        lottieRef.current?.goToAndStop(currentFrame, true);
        const svgMarkup = (lottieContainer.firstChild as SVGElement).outerHTML;

        const svgAsImg = await loadAsImage(svgMarkup, width, height);
        const scaledImage = scaleImage(svgAsImg, SCALE_FACTOR);

        canvasElement.width = scaledImage.width / 2;
        canvasElement.height = scaledImage.height / 2;
        canvasElement2dContext.clearRect(0, 0, width, height);
        canvasElement2dContext.drawImage(scaledImage, 0, 0, width, height);

        const blob = await canvasToBlobAsync(canvasElement);

        if (!blob) {
          return;
        }

        images?.file(`${generateFrameName(fileName, frameCursor)}.png`, blob);
        frameCursor++;
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${fileName}.zip`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={cn.root}>
      <div>
        Number of frames:{" "}
        <input
          type="number"
          onChange={(e) => setLessFrames(parseInt(e.target.value) || 0)}
          value={lessFrames}
        />
      </div>
      <div>
        <input
          type="number"
          onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
          value={width}
        />{" "}
        x{" "}
        <input
          type="number"
          onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
          value={height}
        />
      </div>
      <div>
        <div ref={lottieContainerRef} className={cn.player} />
      </div>
      <div style={{ display: "none" }}>
        <canvas ref={canvasRef} />
      </div>
      <div className={cn.buttons}>
        <button onClick={download}>DOWNLOAD PNGS</button>
        <button onClick={onReset}>RESET</button>
      </div>
    </div>
  );
};
