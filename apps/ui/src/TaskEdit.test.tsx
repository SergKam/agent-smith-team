import React from "react";
import { render, screen } from "@testing-library/react";
import { AdminContext, ResourceContextProvider } from "react-admin";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TaskEdit from "./TaskEdit";

const mockDataProvider = {
  getOne: jest.fn().mockResolvedValue({
    data: {
      id: 1,
      title: "Test Task",
      description: "Task description",
      status: "pending",
      type: "task",
      priority: "medium",
    },
  }),
  update: jest
    .fn()
    .mockResolvedValue({ data: { id: 1, title: "Updated Task" } }),
} as any;

test("renders TaskEdit component", async () => {
  render(
    <MemoryRouter initialEntries={["/tasks/1"]}>
      <AdminContext dataProvider={mockDataProvider}>
        <ResourceContextProvider value="tasks">
          <Routes>
            <Route path="/tasks/:id" element={<TaskEdit />} />
          </Routes>
        </ResourceContextProvider>
      </AdminContext>
    </MemoryRouter>
  );

  expect(await screen.findByLabelText(/title/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/assigned to/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/description/i)).toBeInTheDocument();
});
