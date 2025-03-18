import {
  Distances,
  MapTaskToCoordinates,
  TaskToRowIndexMap,
  TaskCoordinates,
  TaskOrEmpty,
  ViewMode,
  Task,
} from "../types/public-types";

import { progressWithByParams, taskXCoordinate } from "./bar-helper";

export const countTaskCoordinates = (
  task: Task,
  taskToRowIndexMap: TaskToRowIndexMap,
  startDate: Date,
  start2Date: Date,
  viewMode: ViewMode,
  rtl: boolean,
  fullRowHeight: number,
  taskHeight: number,
  taskYOffset: number,
  distances: Distances,
  svgWidth: number,
  svg2Width: number
): TaskCoordinates => {
  const { columnWidth, rowHeight } = distances;

  const { id, comparisonLevel = 1, progress, type } = task;

  const indexesAtLevel = taskToRowIndexMap.get(comparisonLevel);

  if (!indexesAtLevel) {
    throw new Error(`Indexes at level ${comparisonLevel} are not found`);
  }

  const rowIndex = indexesAtLevel.get(id);

  if (typeof rowIndex !== "number") {
    throw new Error(`Row index for task ${id} is not found`);
  }

  const x1 = rtl
    ? svgWidth - taskXCoordinate(task.end, startDate, viewMode, columnWidth)
    : taskXCoordinate(task.start, task.start > task.start2 || task.start.getTime() === task.start2.getTime() ? start2Date : startDate, viewMode, columnWidth);
  
  const x2_1 = rtl
    ? svg2Width - taskXCoordinate(task.end2, start2Date, viewMode, columnWidth)
    : taskXCoordinate(task.start2, task.start > task.start2 || task.start.getTime() === task.start2.getTime() ? start2Date : startDate, viewMode, columnWidth);

  const x2 = rtl
    ? svgWidth - taskXCoordinate(task.start, startDate, viewMode, columnWidth)
    : taskXCoordinate(task.end, task.start > task.start2 || task.start.getTime() === task.start2.getTime() ? start2Date : startDate, viewMode, columnWidth);
  
  const x2_2 = rtl
    ? svg2Width - taskXCoordinate(task.start2, start2Date, viewMode, columnWidth)
    : taskXCoordinate(task.end2, task.start > task.start2 || task.start.getTime() === task.start2.getTime() ? start2Date : startDate, viewMode, columnWidth);

  const levelY = rowIndex * fullRowHeight + rowHeight * (comparisonLevel - 1);
  const levelY2 = rowIndex * fullRowHeight + rowHeight * (comparisonLevel - 1);

  const y = levelY + taskYOffset;

  const [progressWidth, progressX] =
    type === "milestone"
      ? [0, x1]
      : progressWithByParams(x1, x2, progress, rtl);

  const taskX1 = type === "milestone" ? x1 - taskHeight * 0.5 : x1;
  const taskX2_1 = type === "milestone" ? x2_1 - taskHeight * 0.5 : x2_1;

  const taskX2 = type === "milestone" ? x2 + taskHeight * 0.5 : x2;
  const taskX2_2 = type === "milestone" ? x2_2 + taskHeight * 0.5 : x2_2;

  const taskWidth = type === "milestone" ? taskHeight : taskX2 - taskX1;
  const taskWidth2 = type === "milestone" ? taskHeight : taskX2_2 - taskX2_1;
  let containerX = taskX1 - columnWidth;
  let containerX2 = taskX2_1 - columnWidth;
  if (task.start < task.start2) {
    containerX = taskX1 - columnWidth;
    containerX2 = taskX2_1 - columnWidth;
  }
  const containerWidth = svgWidth - containerX;
  const containerWidth2 = svgWidth - containerX2;

  const innerX1 = columnWidth;
  const innerX2_1 = columnWidth;
  const innerX2 = columnWidth + taskWidth;
  const innerX2_2 = columnWidth + taskWidth2;


  return {
    containerWidth,
    containerWidth2,
    containerX,
    containerX2,
    innerX1,
    innerX2_1,
    innerX2,
    innerX2_2,
    levelY,
    levelY2,
    progressWidth,
    progressX,
    width: taskWidth,
    width2: taskWidth2,
    x1: taskX1,
    x2: taskX2,
    y,
  };
};

/**
 * @param tasks List of tasks
 */
export const getMapTaskToCoordinates = (
  tasks: readonly TaskOrEmpty[],
  visibleTasksMirror: Readonly<Record<string, true>>,
  taskToRowIndexMap: TaskToRowIndexMap,
  startDate: Date,
  start2Date: Date,
  viewMode: ViewMode,
  rtl: boolean,
  fullRowHeight: number,
  taskHeight: number,
  taskYOffset: number,
  distances: Distances,
  svgWidth: number,
  svg2Width: number,
): MapTaskToCoordinates => {
  const res = new Map<number, Map<string, TaskCoordinates>>();

  tasks.forEach(task => {
    if (task.type === "empty") {
      return;
    }

    const { id, comparisonLevel = 1 } = task;

    if (!visibleTasksMirror[id]) {
      return;
    }

    const taskCoordinates = countTaskCoordinates(
      task,
      taskToRowIndexMap,
      startDate,
      start2Date,
      viewMode,
      rtl,
      fullRowHeight,
      taskHeight,
      taskYOffset,
      distances,
      svgWidth,
      svg2Width
    );

    const resByLevel =
      res.get(comparisonLevel) || new Map<string, TaskCoordinates>();
    resByLevel.set(id, taskCoordinates);
    res.set(comparisonLevel, resByLevel);
  });

  return res;
};
