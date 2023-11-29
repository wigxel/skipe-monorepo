import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { Button } from "~/components/ui/button";

const isFileOverLimit = (file) => {
  if (!file) return false;
  return file?.size / 1_000_000 > 1;
};

const mimeTypes = ["image/png", "image/jpeg"];

export function ImageBox({ ft }) {
  const hasImage = ft.file.type === "present" && !isFileOverLimit(ft);

  return (
    <section className={"space-y-4"}>
      <label
        htmlFor={"request-image"}
        className={
          "flex items-center flex-col space-y-4 group justify-center aspect-[4/3] border-2 border-gray-600 rounded-2xl border-dashed focus-within:ring-2 ring-ring ring-offset-2"
        }
      >
        {hasImage ? (
          <div className={"p-4"}>
            <Image
              alt={"Image"}
              src={ft.file.base64}
              className={
                "w-full aspect-square bg-gray-50 rounded-lg object-contain border"
              }
              objectFit={"contain"}
              width={500}
              height={500}
            />
          </div>
        ) : (
          <>
            <ImagePlus
              size={"1em"}
              className={
                "transform origin-center  group-hover:rotate-[0deg] group-hover:text-gray-700 transition-all duration-200 rotate-[12deg] text-[4rem] text-gray-500"
              }
            />
            <p className={"text-muted-foreground"}>Click to add photo here</p>
          </>
        )}

        <input
          id={"request-image"}
          type={"file"}
          name={"file"}
          className={
            "absolute w-[0.1px] h-[0.1px] opacity-0 pointer-events-none"
          }
          accept={mimeTypes.join(",")}
          onChange={ft.fromInputEvent}
        />
      </label>

      {!hasImage ? (
        <p className={"text-center text-sm italic text-muted-foreground"}>
          Supports only <span className="text-foreground">PNG</span>,{" "}
          <span className="text-foreground">JPG</span> and{" "}
          <span className="text-foreground">WebP</span> image formats
        </p>
      ) : (
        <div className={"flex space-x-6 text-center justify-center"}>
          <Button
            asChild
            variant={"ghost"}
            className={"font-display rounded-full"}
          >
            <label htmlFor={"request-image"}>Change Image</label>
          </Button>

          <Button
            variant={"ghost"}
            className={"font-display hover:text-destructive rounded-full"}
            onClick={() => ft.reset()}
          >
            Remove Image
          </Button>
        </div>
      )}
    </section>
  );
}
