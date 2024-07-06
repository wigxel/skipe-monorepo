import React from "react";

export function SkeletonList(props: {
  count: number;
  children?: React.ReactNode;
}) {
  const { count = 5 } = props;

  return (
    <>
      {Array.from({ length: count }).map((e, index) => {
        return (
          <div key={index} style={{ opacity: ((6 - index) * 100) / 5 / 100 }}>
            {props.children}
          </div>
        );
      })}
    </>
  );
}
