import React, { useMemo } from "react";

import { ColorStyles } from "../../../types/public-types";

import style from "./bar.module.css";

type BarDisplayProps = {
  barCornerRadius: number;
  isCritical: boolean;
  isSelected: boolean;
  hasChildren: boolean;
  height: number;
  progressWidth: number;
  /* progress start point */
  progressX: number;
  startMoveFullTask: (clientX: number) => void;
  styles: ColorStyles;
  taskName: string;
  width: number;
  width2: number;
  x: number;
  x2: number;
  y: number;
  y2: number;
};

export const BarDisplay: React.FC<BarDisplayProps> = ({
  taskName,
  barCornerRadius,
  isCritical,
  isSelected,
  hasChildren,
  height,
  progressWidth,
  progressX,
  startMoveFullTask,
  styles,
  width,
  width2,
  x,
  x2,
  y,
  y2,
}) => {
  const processColor = useMemo(() => {
    if (isCritical) {
      if (hasChildren) {
        if (isSelected) {
          return styles.groupProgressSelectedCriticalColor;
        }

        return styles.groupProgressCriticalColor;
      }

      if (isSelected) {
        return styles.barProgressSelectedCriticalColor;
      }

      return styles.barProgressCriticalColor;
    }

    if (hasChildren) {
      if (isSelected) {
        return styles.groupProgressSelectedColor;
      }

      return styles.groupProgressColor;
    }

    if (isSelected) {
      return styles.barProgressSelectedColor;
    }

    return styles.barProgressColor;
  }, [isSelected, isCritical, hasChildren, styles]);

  const barColor = useMemo(() => {
    if (isCritical) {
      if (hasChildren) {
        if (isSelected) {
          return styles.groupBackgroundSelectedCriticalColor;
        }

        return styles.groupBackgroundCriticalColor;
      }

      if (isSelected) {
        return styles.barBackgroundSelectedCriticalColor;
      }

      return styles.barBackgroundCriticalColor;
    }

    if (hasChildren) {
      if (isSelected) {
        return styles.groupBackgroundSelectedColor;
      }

      return styles.groupBackgroundColor;
    }

    if (isSelected) {
      return styles.barBackgroundSelectedColor;
    }

    return styles.barBackgroundColor;
  }, [isSelected, isCritical, hasChildren, styles]);

  return (
    <g
      data-testid={`task-bar-${taskName}`}
      onMouseDown={e => {
        startMoveFullTask(e.clientX);
      }}
      onTouchStart={e => {
        const firstTouch = e.touches[0];

        if (firstTouch) {
          startMoveFullTask(firstTouch.clientX);
        }
      }}
    >
      <rect
        x={x2}
        width={width2}
        y={y2}
        height={height + 10}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={'rgba(227, 210, 192, 1)'}
      />
      <rect
        x={x}
        width={width}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={barColor}
        className={style.barBackground}
      />
      <rect
        x={progressX}
        width={progressWidth}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={processColor}
      />
    </g>
  );
};
