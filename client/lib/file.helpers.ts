export function readBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      resolve(reader.result as string);
    });

    reader.addEventListener("error", () => {
      reject(reader.error);
    });

    reader.readAsDataURL(file);
  });
}

export function readFilesBase64(files: File[]) {
  return Promise.all(files.map((file) => readBase64(file)));
}

export function dataURLtoFile(dataUrl: string, filename: string) {
  if (!dataUrl) return;

  try {
    const arr = dataUrl?.split(",");

    // @ts-ignore
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  } catch (err) {
    return;
  }
}
