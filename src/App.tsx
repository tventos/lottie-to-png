import { useState, ChangeEvent } from "react";

import { Step2 } from "./Step2";
import { isLottie } from "./lib/isLottie";

import cn from "./App.module.scss";

export const App = () => {
  const [lottieData, setLottieData] = useState<string>();
  const [fileName, setFileName] = useState<string>();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const file = event.target.files[0];

    if (file) {
      setFileName(file.name);

      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) {
          return;
        }

        const result = e.target.result as string;

        if (!isLottie(result)) {
          alert("Isn't lottie");
          return;
        }

        setLottieData(result);
      };

      reader.readAsText(file);
    }
  };

  const reset = () => {
    setLottieData(undefined);
    setFileName(undefined);
  };

  return (
    <div className={cn.root}>
      {lottieData && fileName ? (
        <Step2 lottieData={lottieData} fileName={fileName} onReset={reset} />
      ) : (
        <>
          <div className={cn.inputWrapper}>
            <input
              type="file"
              onChange={handleFileChange}
              accept="json"
              className={cn.input}
            />
          </div>
          <div>
            Hint: You can name the file as lottie.<b>400</b>.json, which means
            you want to make the images 400x400 in size.
          </div>
        </>
      )}
    </div>
  );
};
