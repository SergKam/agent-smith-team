import React from "react";
import { render, screen } from "@testing-library/react";
import {
  TestMemoryRouter,
  AdminContext,
  Resource,
  ListGuesser,
  ResourceContextProvider,
} from "react-admin";
import UserCreate from "./UserCreate";
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
describe("UserCreate", () => {
  it("renders the Create component", () => {
    render(
      <AdminContext dataProvider={mockDataProvider}>
        <ResourceContextProvider value="users">
          <UserCreate />
        </ResourceContextProvider>
      </AdminContext>
    );
    expect(
      screen.getByRole("textbox", { name: "resources.users.fields.name" })
    ).toBeInTheDocument();
  });
});
