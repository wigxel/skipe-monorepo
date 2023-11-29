"use client";
import { useFormStatus } from "react-dom";
import { useFileTransform } from "~/hooks/use-file-transform";
import React from "react";
import { AutoType, typeSuggestions, typeWords } from "./auto-type";
import Balancer from "react-wrap-balancer";
import { ImageBox } from "~/components/ImageBox";
import { cn } from "~/lib/utils";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { CategoryDropdown } from "~/components/Select";
import { Button, ButtonContent } from "~/components/Button";
import { Slot } from "@radix-ui/react-slot";

const mimeTypes = ["image/png", "image/jpeg"];

const suggestions = [
  "Krypton's Dog food.",
  "I'm looking for a replacement for my broken blend cutter.",
  "A HDMI to USB-C cord for my personal computer.",
  "I'm in need of Eco Tap head within 5 - 40k",
  "I'm looking for a smart bulb that can pair with my phone",
  "An Vacuum cleaner charger about 32 Volts.",
];

export function RequestForm() {
  const { pending } = useFormStatus();

  const ft = useFileTransform({
    allowedMimeTypes: mimeTypes,
  });

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
          <AutoType
            focusText={"Leave a detailed description"}
            otherText={suggestions}
          >
            <Textarea
              style={{ height: 80 }}
              name={"description"}
              className={"rounded-2xl font-sans"}
            />
          </AutoType>
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
