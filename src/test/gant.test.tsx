import React from "react";
import { Gantt } from "../index";
import { createRoot } from 'react-dom/client';

describe("gantt", () => {
  it("renders without crashing", () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(<Gantt
      tasks={[
        {
          start: new Date(2020, 0, 1),
          start2: new Date(2020, 0, 2),
          end: new Date(2020, 2, 2),
          end2: new Date(2020, 2, 3),
          name: "Redesign website",
          id: "Task 0",
          progress: 45,
          type: "task",
        },
      ]}
    />);
  });
});
