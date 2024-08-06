import React from "react";
import { render, screen } from "@testing-library/react";
import { AdminContext, ResourceContextProvider } from "react-admin";
import UsersList from "./UsersList";

const mockDataProvider = {
  getList: jest
    .fn()
    .mockResolvedValue({ data: [{ id: 1, name: "John Doe" }], total: 1 }),
  getOne: jest.fn(),
  getMany: jest.fn(),
  getManyReference: jest.fn(),
  update: jest.fn(),
  updateMany: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
};

test("renders UsersList component", async () => {
  const res= render(
    <AdminContext dataProvider={mockDataProvider}>
      <ResourceContextProvider value="users">
      <UsersList/>
      </ResourceContextProvider>
    </AdminContext>
  );

 expect(await screen.findByText("John Doe")).toBeInTheDocument();
});
