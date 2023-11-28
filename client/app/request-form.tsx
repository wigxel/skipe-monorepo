"use client";
import { useFormStatus } from "react-dom";
import { useFileTransform } from "~/hooks/use-file-transform";
import React from "react";
import { typeSuggestions, typeWords } from "./auto-type";
import Balancer from "react-wrap-balancer";
import { ImageBox } from "~/components/ImageBox";
import { cn } from "~/lib/utils";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { CategoryDropdown } from "~/components/Select";
import { Button, ButtonContent } from "~/components/Button";

const mimeTypes = ["image/png", "image/jpeg"];

export function RequestForm() {
  const { pending } = useFormStatus();

  const ft = useFileTransform({
    allowedMimeTypes: mimeTypes,
  });

  const textArea = React.useRef<HTMLTextAreaElement>();

  React.useEffect(() => {
    if (ft.file.type !== "present") return;

    const el = textArea.current;
    if (!el) return;
    const handle = typeSuggestions(textArea.current);

    const onFocus = () => {
      handle.stop();
      if (!el.value) {
        typeWords(el, "Leave a detailed description");
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
  }, [ft.file.type]);

  return (
    <div>
      <Card className={"space-y-12 relative z-20"}>
        <hgroup className={"space-y-4 mx-auto flex items-center flex-col"}>
          <h4
            className={
              "font-semibold font-display max-w-xs text-2xl tracking-[-1px] text-gray-800 text-center"
            }
          >
            <Balancer ratio={0.2}> Need a possibly rare item ? </Balancer>
          </h4>
          <p
            className={
              "font-medium text-gray-800 text-base text-opacity-70 text-center"
            }
          >
            <Balancer>Upload a photo of the item you need </Balancer>
          </p>
        </hgroup>

        <ImageBox ft={ft} />
      </Card>
      <Card
        className={cn(
          "relative z-10 bg-gray-50 space-y-4 transform transition-all duration-300 mt-[-68%] scale-90",
          {
            "mt-[-38px] scale-100": ft.file.type === "present",
          },
        )}
      >
        <CategoryDropdown />

        <div className={"space-y-2 pt-4"}>
          <Label>What are you looking for?</Label>
          <Textarea
            style={{
              height: 80,
            }}
            ref={textArea}
            name={"description"}
            className={"rounded-2xl font-sans"}
          />
        </div>

        <div className={"flex space-x-2"}>
          <Button className={"w-full"} size={"lg"}>
            <ButtonContent isLoading={pending}>SHARE</ButtonContent>
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Card(props) {
  return (
    <div
      className={cn(
        "bg-white shrink-0 py-12 px-12 w-[500px] rounded-3xl",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
