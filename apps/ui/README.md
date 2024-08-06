# ui

The UI application is a [React](https://reactjs.org/) application that uses [React Admin](https://marmelab.com/react-admin/) to provide
an admin interface for tasks development workflow and interact with AI agents.
The application is using task manager API [../../shared/api.yaml] to fetch and update data.

It uses [Vite](https://vitejs.dev/) as the build tool.


## Installation

Install the application dependencies by running:

```sh
npm install
```

## Development

Start the application in development mode by running:

```sh
npm run dev
```

## Production

Build the application in production mode by running:

```sh
npm run build
```

## DataProvider

The included data provider use [ra-data-simple-rest](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-simple-rest). It fits REST APIs using simple GET parameters for filters and sorting. This is the dialect used for instance in [FakeRest](https://github.com/marmelab/FakeRest).

You'll find an `.env` file at the project root that includes a `VITE_JSON_SERVER_URL` variable. Set it to the URL of your backend.

## Testing

Run the tests by running:

```sh
npm run test
```
It runs both unit and end to end tests.

### Unit tests
To run only unit tests, run:
```sh
npm run test:unit
```

Unit tests example for the component `UsersList`: 
```tsx
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
```

### End to end tests
End to end tests use jest-puppeteer and run on a headless browser. 
example: 
```tsx
const port = process.env.PORT;
describe("App", () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${port}/`);
  });

  it("should be titled ui", async () => {
    await expect(page.title()).resolves.toMatch("ui");
  });
});
```
To run the end to end tests, you need to run the application in development mode (if it's not already running):
```
npm run dev
```

and then run the tests:
```sh
npm run test:e2e
```
