import { Slot } from "@radix-ui/react-slot";
import React from "react";

const default_sentences = [
  "Krypton's Dog food.",
  "I'm looking for a replacement for my broken blend cutter.",
  "A HDMI to USB-C cord for my personal computer.",
  "I'm in need of Eco Tap head within 5 - 40k",
  "I'm looking for a smart bulb that can pair with my phone",
  "An Vacuum cleaner charger about 32 Volts.",
];

export function typeSuggestions(
  config: Partial<{ swapDuration: number }>,
  inputEl: HTMLTextAreaElement | HTMLInputElement,
  sentences = default_sentences,
) {
  const { swapDuration = 3000 } = config ?? {};
  let stop = false;

  return {
    async start() {
      if (!inputEl.contentEditable) return;
      for await (let sent of sentences) {
        if (stop) break;
        await typeWords(inputEl, sent, stop);
        await delay(swapDuration);
        this.completed();
      }
    },
    continue() {
      stop = false;
      this.start();
    },
    completed() {},
    stop() {
      stop = true;
    },
  } as const;
}

export async function typeWords(
  el: HTMLTextAreaElement | HTMLInputElement,
  text: string,
  stop?: boolean,
) {
  el.placeholder = "";
  const words = text.split(" ");
  for await (const word of words) {
    if (stop) break;
    el.placeholder += word + " ";
    await delay(200);
  }
}

function delay(delay) {
  return new Promise((res) => setTimeout(res, delay));
}

export function AutoType(props: {
  otherText: string[];
  focusText: string;
  swapDuration?: number;
  children?: React.ReactNode;
}) {
  const textArea = React.useRef<HTMLTextAreaElement>();

  React.useEffect(() => {
    const el = textArea.current;

    if (!el) return;
    const handle = typeSuggestions(
      { swapDuration: props.swapDuration },
      textArea.current,
    );

    const onFocus = () => {
      handle.stop();
      if (!el.value) {
        typeWords(el, props.focusText);
      }
    };

    const onBlur = () => {
      if (el.value) return;
      handle.continue();
    };

    handle.start();
    el.addEventListener("focus", onFocus);
    el.addEventListener("blur", onBlur);

    return () => {
      handle.stop();
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("blur", onBlur);
    };
  }, [props.focusText, props.swapDuration]);

  return <Slot ref={textArea}>{props.children}</Slot>;
}
