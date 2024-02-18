import React, { ComponentProps } from "react";
import debounce from "lodash/debounce";
import { Slot } from "@radix-ui/react-slot";
import { composeRefs } from "~/lib/compose-ref";
import { useMessageSubscription } from "~/hooks/use-message-subscription";

type ScrollParams = {
  height: number;
  offset_top: number;
  viewport_height: number;
};

/**
 * Automatically scroll to the bottom when a new child is inserted
 * **/
export const ScrollToBottom = React.forwardRef<
  HTMLElement,
  {
    children?: React.ReactNode;
    canScroll?: (params: ScrollParams) => boolean;
    getScrollContainer?: (target: HTMLElement) => HTMLElement;
  }
>(function ScrollToBottom(props, ref) {
  const targetNode = React.useRef<HTMLElement>();
  const targetRef = composeRefs(targetNode, ref);

  const scrollToBottom = React.useMemo(
    () =>
      debounce((target: HTMLElement, config: { force: boolean }) => {
        if (props.getScrollContainer) {
          const container = props.getScrollContainer(target);
          if (!container) {
            return console.warn("No scrollable element found", {
              element: container,
            });
          }
          if (
            props.canScroll({
              height: target.offsetHeight,
              offset_top: container.scrollTop,
              viewport_height: container.offsetHeight,
            })
          )
            container.scrollTop = target.offsetHeight + 200;
        } else {
          if (
            props.canScroll({
              height: target.offsetHeight,
              offset_top: target.scrollTop,
              viewport_height: target.offsetHeight,
            })
          ) {
            target.scrollTop = target.offsetHeight + 200;
          }
        }
      }, 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  React.useEffect(() => {
    const config = { attributes: false, childList: true, subtree: false };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList" && mutation.target) {
          scrollToBottom(mutation.target, { force: false });
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode.current, config);

    // Later, you can stop observing
    return () => {
      observer.disconnect();
    };
  }, [props, scrollToBottom]);

  return <Slot ref={targetRef}>{props.children}</Slot>;
});

export function MessagesBox(props: ComponentProps<typeof ScrollToBottom>) {
  const targetNode = React.useRef<HTMLElement>();
  const state = React.useRef({ count: 0, new_message_from_me: false });

  const scroll_observer = React.useMemo(() => {
    const is_scrolling = Symbol("is_scrolling");
    return {
      [is_scrolling]: false,
      getState() {
        return this[is_scrolling];
      },
      onStart() {
        this[is_scrolling] = true;
      },
      onEnd() {
        this[is_scrolling] = false;
      },
    };
  }, []);

  useMessageSubscription("channel_id", (messages) => {
    for (let message of messages) {
      if (message.recipient === "some-random-id") {
        // goto to bottom
        state.current.new_message_from_me = true;
      }
    }
  });

  function canScroll(params: ScrollParams) {
    if (state.current.count === 0) {
      state.current.count++;
      return true;
    }

    // force scroll to the bottom when you receive a message from me
    if (state.current.new_message_from_me) {
      state.current.new_message_from_me = false;
      return true;
    }

    if (!(isCloseToBottom(params) && !scroll_observer.getState())) {
      console.log("Autoscroll is disabled when view-area completely offsets");
      return false;
    }

    return true;

    function isCloseToBottom({
      height,
      offset_top,
      viewport_height,
    }: ScrollParams) {
      // only scroll to bottom when scroll container is close to the bottom
      return offset_top + viewport_height > height - viewport_height * 0.3;
    }
  }

  React.useEffect(() => {
    if (targetNode.current) {
      targetNode.current.parentElement.addEventListener(
        "scroll",
        scroll_observer.onStart,
      );
      targetNode.current.parentElement.addEventListener(
        "scrollend",
        scroll_observer.onEnd,
      );
    }

    return () => {
      if (targetNode.current) {
        targetNode.current.parentElement.removeEventListener(
          "scroll",
          scroll_observer.onStart,
        );
        targetNode.current.parentElement.removeEventListener(
          "scrollend",
          scroll_observer.onEnd,
        );
      }
    };
  });

  return (
    <ScrollToBottom ref={targetNode} {...props} canScroll={canScroll}>
      {props.children}
    </ScrollToBottom>
  );
}
