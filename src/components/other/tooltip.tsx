import React, {
  ComponentType,
} from "react";

import type { Strategy } from "@floating-ui/dom";

import type {
  Task,
} from "../../types/public-types";

import styles from "./tooltip.module.css";

export type TooltipProps = {
  tooltipX: number | null;
  tooltipY: number | null;
  tooltipStrategy: Strategy;
  setFloatingRef: (node: HTMLElement | null) => void;
  getFloatingProps: () => Record<string, unknown>;
  task: Task;
  fontSize: string;
  fontFamily: string;
  TooltipContent: ComponentType<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
};

export const Tooltip: React.FC<TooltipProps> = ({
  tooltipX,
  tooltipY,
  tooltipStrategy,
  setFloatingRef,
  getFloatingProps,
  task,
  fontSize,
  fontFamily,
  TooltipContent,
}) => {
  return (
    <div
      ref={setFloatingRef}
      style={{
        position: tooltipStrategy,
        top: tooltipY ?? 0,
        left: tooltipX ?? 0,
        width: 'max-content',
      }}
      {...getFloatingProps()}
    >
      <TooltipContent task={task} fontSize={fontSize} fontFamily={fontFamily} />
    </div>
  );
};

export const StandardTooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {
  const style = {
    fontSize,
    fontFamily,
  };

  if (!task.start || !task.end) return null;

  return (
    <div
      className={styles.tooltipDefaultContainer}
      style={style}
    >
      <b style={{ fontSize: fontSize + 6 }}>{`${
        task.name
      }: ${task.start?.getDate()}-${
        task.start.getMonth() + 1
      }-${task.start?.getFullYear()} - ${task.end?.getDate()}-${
        task.end?.getMonth() + 1
      }-${task.end?.getFullYear()}`}</b>
      {task.end?.getTime() - task.start?.getTime() !== 0 && (
        <p className={styles.tooltipDefaultContainerParagraph}>{`Продолжительность: ${~~(
          (task.end?.getTime() - task.start?.getTime()) /
          (1000 * 60 * 60 * 24)
        )} ${createLabel((task.end?.getTime() - task.start?.getTime()) / (1000 * 60 * 60 * 24), ['День', 'Дня', 'Дней'])}`}</p>
      )}

      <p className={styles.tooltipDefaultContainerParagraph}>
        {!!task.progress && `Прогресс: ${task.progress} %`}
      </p>
    </div>
  );
};


function createLabel(number: number, titles: string[]): string {
  const cases = [2, 0, 1, 1, 1, 2];
  return `${titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]]}`;
}
