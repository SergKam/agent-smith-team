import React from "react";
import { render, screen } from "@testing-library/react";
import {
  AdminContext,
  ResourceContextProvider,
} from "react-admin";
import UserCreate from "./UserCreate";
const mockDataProvider = {
  getList: jest
    .fn()
    .mockResolvedValue({ data: [{ id: 1, name: "John Doe" }], total: 1 }),
} as any;
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
