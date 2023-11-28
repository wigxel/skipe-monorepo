import React, { ChangeEvent } from "react";
import { trace } from "@wigxel/utils";
import { readBase64 } from "../lib/file.helpers";

type ITransformFile =
  | { type: "empty"; base64: ""; file: null }
  | {
      type: "present";
      file: File;
      base64: string;
    };

const EmptyState: ITransformFile = {
  type: "empty",
  base64: "",
  file: null,
};

export const useFileTransform = (options?: { allowedMimeTypes: string[] }) => {
  const { allowedMimeTypes = [] } = options || {};
  const [file, setFile] = React.useState<ITransformFile>(EmptyState);

  const transformFile = (file: File | null) => {
    if (!(file instanceof File))
      return trace("Transformation failed for file")(file);

    if (allowedMimeTypes.length > 0) {
      if (!allowedMimeTypes.includes(file.type))
        return trace("Mime type not allowed:")(file);
    }

    readBase64(file)
      .then((base64) =>
        setFile({
          type: "present",
          base64: base64,
          file,
        }),
      )
      .catch(() => trace("Transformation failed for file", file));
  };

  const fromInputEvent = (evt: ChangeEvent<HTMLInputElement>) => {
    const target = evt.target;
    transformFile((target?.files || [null])[0]);
  };

  const reset = () => setFile(EmptyState);

  return {
    file,
    transformFile,
    fromInputEvent,
    reset,
  };
};
