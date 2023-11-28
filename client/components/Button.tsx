import { Button as Button_ } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import React, { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export function Button(props: ComponentProps<typeof Button_>) {
  const { size, className, variant, ...PROPS } = props;

  return (
    <Button_
      {...PROPS}
      className={cn(
        "space-x-2 w-full rounded-full font-display",
        {
          "!py-8": size === "lg",
          "tracking-[2px]": variant != "link",
        },
        className,
      )}
      size={size}
      variant={variant}
    >
      {props.children}
    </Button_>
  );
}

export function ButtonContent(props: {
  children: React.ReactNode;
  isLoading: boolean;
}) {
  return (
    <>
      {props.isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        props.children
      )}
    </>
  );
}
