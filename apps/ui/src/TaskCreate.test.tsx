import React from "react";
import { render, screen } from "@testing-library/react";
import { AdminContext, ResourceContextProvider } from "react-admin";
import TaskCreate from "./TaskCreate";
import "@testing-library/jest-dom";

const mockDataProvider = {
  create: jest.fn().mockResolvedValue({ data: { id: 1, title: "New Task" } }),
} as any;

test("renders TaskCreate component", async () => {
  render(
    <AdminContext dataProvider={mockDataProvider}>
      <ResourceContextProvider value="tasks">
        <TaskCreate />
      </ResourceContextProvider>
    </AdminContext>
  );

  expect(await screen.findByLabelText(/title/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/assigned to/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/description/i)).toBeInTheDocument();
});
