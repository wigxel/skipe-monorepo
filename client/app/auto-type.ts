const default_sentences = [
  "Krypton's Dog food.",
  "I'm looking for a replacement for my broken blend cutter.",
  "A HDMI to USB-C cord for my personal computer.",
  "I'm in need of Eco Tap head within 5 - 40k",
  "I'm looking for a smart bulb that can pair with my phone",
  "An Vacuum cleaner charger about 32 Volts.",
];

export function typeSuggestions(inputEl, sentences = default_sentences) {
  let stop = false;

  return {
    async start() {
      if (!inputEl.contentEditable) return;
      for await (let sent of sentences) {
        if (stop) break;
        await typeWords(inputEl, sent, stop);
        await delay(3000);
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
  el: HTMLTextAreaElement,
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
