import fakeRestDataProvider from "ra-data-fakerest";
const data = {
  tasks: [
    { id: 1, title: "Task 1", description: "Description 1", status: "pending", type: "task", priority: "medium" },
    { id: 2, title: "Task 2", description: "Description 2", status: "in_progress", type: "story", priority: "high" }
  ]
};


export const dataProvider = fakeRestDataProvider(
  data,
  process.env.NODE_ENV !== "test"
);
