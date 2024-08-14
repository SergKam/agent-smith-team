import React from "react";
import { render, screen } from "@testing-library/react";
import { AdminContext, ResourceContextProvider } from "react-admin";
import TaskList from "./TaskList";

const mockDataProvider = {
  getList: jest
    .fn()
    .mockResolvedValue({
      data: [
        {
          id: 1,
          title: "Test Task",
          description: "Task description",
          status: "pending",
          type: "task",
          priority: "medium",
        },
      ],
      total: 1,
    }),
  getOne: jest.fn(),
  getMany: jest.fn(),
  getManyReference: jest.fn(),
  update: jest.fn(),
  updateMany: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
};

test("renders TaskList component", async () => {
  render(
    <AdminContext dataProvider={mockDataProvider}>
      <ResourceContextProvider value="tasks">
        <TaskList />
      </ResourceContextProvider>
    </AdminContext>
  );

  expect(await screen.findByText("Test Task")).toBeInTheDocument();
  expect(await screen.findByText("pending")).toBeInTheDocument();
  expect(await screen.findByText("task")).toBeInTheDocument();
  expect(await screen.findByText("medium")).toBeInTheDocument();
});
