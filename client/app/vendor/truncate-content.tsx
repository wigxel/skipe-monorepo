"use client";
import React, { ComponentProps, useRef } from "react";
import { cn } from "~/lib/utils";

interface TruncateContentProps extends ComponentProps<"p"> {
  as?: keyof React.JSX.IntrinsicElements;
  expandable?: boolean;
  maxNumOfLines: number;
}

export const TruncateContent = (props: TruncateContentProps) => {
  const {
    maxNumOfLines,
    expandable = false,
    dangerouslySetInnerHTML,
    ...rest
  } = props;
  const Comp = props.as || "p";
  const ref = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const [overflows, setOverflows] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;
    const parent = ref.current;
    const firstChild = parent.children[0];

    if (!firstChild) return;
    const overflows =
      firstChild.scrollHeight > (firstChild as HTMLDivElement).offsetHeight;

    setOverflows(overflows);
  }, [overflows]);

  const content = (
    // @ts-expect-error
    <Comp
      {...rest}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      className={cn(rest.className, "overflow-hidden overflow-ellipsis")}
      style={
        isCollapsed
          ? {
              display: "-webkit-box",
              WebkitLineClamp: maxNumOfLines,
              lineClamp: maxNumOfLines,
              WebkitBoxOrient: "vertical",
            }
          : undefined
      }
    >
      {rest.children}
    </Comp>
  );

  if (!expandable) return content;

  return (
    <div ref={ref} {...rest}>
      {content}

      {isCollapsed && overflows ? (
        <button
          className="link-text text-base"
          onClick={() => setIsCollapsed(false)}
        >
          Read More...
        </button>
      ) : !isCollapsed ? (
        <button
          className="link-text text-base"
          onClick={() => setIsCollapsed(true)}
        >
          See Less...
        </button>
      ) : null}
    </div>
  );
};
