import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

export function RequestInfoModal(props: {
  data: Record<string, any>;
  children?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogOverlay>
        <DialogContent>
          <DialogTitle className={"font-display tracking-tighter font-bold"}>
            Request Info
          </DialogTitle>

          <figure
            className={"flex-1 bg-gray-200 aspect-square w-full rounded-lg"}
          ></figure>

          <section className={"space-y-2"}>
            <h6
              className={
                "uppercase tracking-widest text-sm text-muted-foreground font-display"
              }
            >
              Description
            </h6>

            <p className={"text-gray-800"}>{props.data.description}</p>
          </section>

          <DialogFooter className={"items-end flex"}>
            <DialogTrigger asChild>
              <Button variant={"ghost"} className={"w-auto"}>
                Reject
              </Button>
            </DialogTrigger>
            <Button variant={"secondary"} className={"w-auto"}>
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
