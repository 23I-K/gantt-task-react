import { useCallback, useRef, useState } from "react";
import type { RefObject, SyntheticEvent } from "react";

import { SCROLL_STEP } from "../../constants";
import { GANTT_TASK_ROOT_ID } from "./task-gantt";

export const useHorizontalScrollbars = (): [
  RefObject<HTMLDivElement>,
  number,
  (nextScrollX: number) => void,
  (event: SyntheticEvent<HTMLDivElement>) => void,
  () => void,
  () => void
] => {
  const [scrollX, setScrollX] = useState(0);
  const isLockedRef = useRef(false);
  const ganttTaskRootRef = useRef<HTMLDivElement>(null);
  const scrollEl = ganttTaskRootRef.current ?? document.getElementById(GANTT_TASK_ROOT_ID);

  const setScrollXProgrammatically = useCallback((nextScrollX: number) => {

    if (!scrollEl) {
      return;
    }

    isLockedRef.current = true;

    if (scrollEl) {
      scrollEl.scrollLeft = nextScrollX;
    }

    setScrollX(scrollEl.scrollLeft);

    setTimeout(() => {
      isLockedRef.current = false;
    }, 300);
  }, [scrollEl]);

  const onVerticalScrollbarScrollX = useCallback(
    (event: SyntheticEvent<HTMLDivElement>) => {
      if (isLockedRef.current) {
        return;
      }

      const nextScrollX = event.currentTarget.scrollLeft;

      if (scrollEl) {
        scrollEl.scrollLeft = nextScrollX;
      }

      setScrollX(nextScrollX);
    },
    [scrollEl]
  );

  const scrollToLeftStep = useCallback(() => {
    setScrollXProgrammatically(scrollX - SCROLL_STEP);
  }, [setScrollXProgrammatically, scrollX]);

  const scrollToRightStep = useCallback(() => {
    setScrollXProgrammatically(scrollX + SCROLL_STEP);
  }, [setScrollXProgrammatically, scrollX]);

  return [
    ganttTaskRootRef,
    scrollX,
    setScrollXProgrammatically,
    onVerticalScrollbarScrollX,
    scrollToLeftStep,
    scrollToRightStep,
  ];
};
