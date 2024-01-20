"use client";
import Scrollbar_ from "react-custom-scrollbars";
import React from "react";

export function Scrollbar(props: { children?: React.ReactNode }) {
  return (
    <Scrollbar_ universal hideTracksWhenNotNeeded={true} autoHide={true}>
      {props.children}
    </Scrollbar_>
  );
}
