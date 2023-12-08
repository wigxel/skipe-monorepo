"use client";
import { Button } from "~/components/ui/button";
import { Button as AppButton } from "~/components/Button";
import { Check, EyeOff, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ImageBox } from "~/components/ImageBox";
import { useFileTransform } from "~/hooks/use-file-transform";
import React from "react";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { AutoType } from "~/app/auto-type";
import { Input } from "~/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export function RequestActions() {
  return (
    <div
      className={"space-x-2 flex justify-end bg-gray-0 p-2 rounded-lg"}
      onClick={(evt) => {
        evt.stopPropagation();
      }}
    >
      <Button size="sm" variant={"ghost"} className={"rounded-xl space-x-1"}>
        <EyeOff size={18} />
        <span>Ignore</span>
      </Button>

      <ReplyModal data={{}}>
        <Button
          size="sm"
          variant={"outline"}
          className={"rounded-xl space-x-1"}
        >
          <Check className={"text-muted-foreground"} size={18} />
          <span>Interested</span>
        </Button>
      </ReplyModal>
    </div>
  );
}

function ReplyModal(props: {
  data: Record<string, any>;
  children?: React.ReactNode;
}) {
  const ft = useFileTransform();
  const suggestions = [
    "I have 3 types of this product.",
    "The price for this one is 15k",
    "I don't have this exact one. But this one is for 15k",
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogOverlay>
        <DialogContent>
          <DialogTitle className={"font-display tracking-tighter font-bold"}>
            Submit request
          </DialogTitle>
          <p className={"text-muted-foreground"}>Share proof of ownership</p>

          <ImageBox ft={ft} />

          <section className={"space-y-2 mt-4"}>
            <Label className={"text-sm text-muted-foreground flex space-x-2"}>
              <span>Describe the Item you have? </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Info size={"1rem"} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Hello pals</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>

            <AutoType
              swapDuration={5000}
              focusText={"How much does this product cost?"}
              otherText={suggestions}
            >
              <Textarea
                className={"rounded-2xl font-sans"}
                placeholder={"I have 3 types"}
                rows={6}
              />
            </AutoType>
            <div>
              <Label className={"text-sm text-muted-foreground"}>
                Selling Price
              </Label>
              <Input
                className={"rounded-2xl font-sans text-right"}
                placeholder={"20000"}
              />
            </div>
          </section>

          <DialogFooter className={"items-end flex mt-4"}>
            <AppButton size="lg" variant={"secondary"}>
              SUBMIT
            </AppButton>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
