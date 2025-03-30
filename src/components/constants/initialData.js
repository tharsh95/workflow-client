export const initialNodes = [
  {
    id: "start",
    type: "start",
    position: { x: 250, y: 300 },
    data: { label: "Start" },
  },
  {
    id: "end",
    type: "end",
    position: { x: 250, y: 600 },
    data: { label: "End" },
  },
];

export const initialEdges = [
  {
    id: "start-end",
    source: "start",
    target: "end",
  },
]; 