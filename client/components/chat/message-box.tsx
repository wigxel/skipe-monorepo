import React, { ChangeEvent, ComponentProps } from "react";
import { cn } from "~/lib/utils";

export const ChatMessageBox = React.forwardRef<
  HTMLTextAreaElement,
  ComponentProps<"textarea">
>(function ChatMessageBox(props, ref) {
  const { children, className, ...PROPS } = props;
  const [rows, setRows] = React.useState<number>(1);

  function adjustInputRow(event: ChangeEvent<HTMLTextAreaElement>) {
    const new_lines = /\n/gm;

    if (!new_lines.test(event.target.value)) {
      return setRows(0);
    }

    setRows(((event.target.value ?? "").match(new_lines)?.length || 1) + 1);
  }

  return (
    <>
      <textarea
        ref={ref}
        name="msg"
        {...PROPS}
        style={{ height: Math.min(rows * 24, 240) }}
        onChange={(event) => {
          adjustInputRow(event);
          props.onChange(event);
        }}
        className={cn(
          "max-h-[240px] min-h-[40px] px-2 leading-[1.6] flex-1 resize-none text-[1rem] focus:outline-none",
          props.className,
        )}
      />
    </>
  );
});
