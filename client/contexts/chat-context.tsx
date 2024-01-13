import { initialize } from "~/core/chat";
import React from "react";
import { app } from "~/lib/firebase.config";

type CtxValue = ReturnType<typeof initialize>;
const Ctx = React.createContext<CtxValue>({} as CtxValue);

export function ChatProvider(props: {
  app: typeof app;
  children?: React.ReactNode;
}) {
  const value = React.useMemo(() => initialize(props.app), [props.app]);

  return <Ctx.Provider value={value}>{props.children}</Ctx.Provider>;
}

export function useChat() {
  return React.useContext(Ctx);
}
