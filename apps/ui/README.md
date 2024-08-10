# ui

The UI application uses [React Admin](https://marmelab.com/react-admin/) to provide
an admin interface for tasks development workflow and interact with AI agents. You can find the React Admin API documentation [here](https://marmelab.com/react-admin/documentation.html).
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

## React Admin Cheatsheet

### App Configuration
- [`<Admin>`](https://marmelab.com/react-admin/Admin.html): Main component to configure the admin app. Accepts `dataProvider`, `authProvider`, `i18nProvider`, `theme`, and more.
- [`<Resource>`](https://marmelab.com/react-admin/Resource.html): Declares a resource and its CRUD operations. Parameters include `name`, `list`, `create`, `edit`, `show`, and `icon`.

### Data Fetching
- [`useDataProvider`](https://marmelab.com/react-admin/useDataProvider.html): Hook to call the data provider.
- [`useGetList`](https://marmelab.com/react-admin/useGetList.html): Fetch a list of records. Parameters include `resource`, `pagination`, `sort`, and `filter`.
- [`useGetOne`](https://marmelab.com/react-admin/useGetOne.html): Fetch a single record. Parameters include `resource` and `id`.
- [`useCreate`](https://marmelab.com/react-admin/useCreate.html): Create a new record. Parameters include `resource` and `data`.
- [`useUpdate`](https://marmelab.com/react-admin/useUpdate.html): Update an existing record. Parameters include `resource`, `id`, and `data`.
- [`useDelete`](https://marmelab.com/react-admin/useDelete.html): Delete a record. Parameters include `resource` and `id`.

### Security
- [`useAuthProvider`](https://marmelab.com/react-admin/useAuthProvider.html): Hook to interact with the auth provider.
- [`useLogin`](https://marmelab.com/react-admin/useLogin.html): Hook to log in.
- [`useLogout`](https://marmelab.com/react-admin/useLogout.html): Hook to log out.

### List Page
- [`<List>`](https://marmelab.com/react-admin/List.html): Displays a list of records. Accepts `filters`, `pagination`, `sort`, and `perPage`.
- [`<Datagrid>`](https://marmelab.com/react-admin/Datagrid.html): Displays records in a table format. Accepts `rowClick`, `expand`, and `bulkActionButtons`.
- [`<SimpleList>`](https://marmelab.com/react-admin/SimpleList.html): Displays records in a simple list format. Accepts `primaryText`, `secondaryText`, and `tertiaryText`.

### Creation & Edition Pages
- [`<Create>`](https://marmelab.com/react-admin/Create.html): Page to create a new record. Accepts `title`, `actions`, and `redirect`.
- [`<Edit>`](https://marmelab.com/react-admin/Edit.html): Page to edit an existing record. Accepts `title`, `actions`, and `redirect`.
- [`<SimpleForm>`](https://marmelab.com/react-admin/SimpleForm.html): A simple form layout. Accepts `toolbar`, `defaultValues`, and `validate`.

### Show Page
- [`<Show>`](https://marmelab.com/react-admin/Show.html): Page to display a single record. Accepts `title`, `actions`, and `aside`.
- [`<SimpleShowLayout>`](https://marmelab.com/react-admin/SimpleShowLayout.html): A simple layout for showing records.

### Common Hooks
- [`useNotify`](https://marmelab.com/react-admin/useNotify.html): Hook to send notifications.
- [`useRedirect`](https://marmelab.com/react-admin/useRedirect.html): Hook to redirect to another page.

### Fields
- [`<ArrayField>`](https://marmelab.com/react-admin/ArrayField.html): Displays an array of items. Accepts `source`, `label`, and `sortable`.
- [`<BooleanField>`](https://marmelab.com/react-admin/BooleanField.html): Displays a boolean value. Accepts `source`, `label`, and `sortable`.
- [`<ChipField>`](https://marmelab.com/react-admin/ChipField.html): Displays a chip. Accepts `source`, `label`, and `sortable`.
- [`<DateField>`](https://marmelab.com/react-admin/DateField.html): Displays a date. Accepts `source`, `label`, and `sortable`.
- [`<EmailField>`](https://marmelab.com/react-admin/EmailField.html): Displays an email. Accepts `source`, `label`, and `sortable`.
- [`<FileField>`](https://marmelab.com/react-admin/FileField.html): Displays a file. Accepts `source`, `label`, and `sortable`.
- [`<FunctionField>`](https://marmelab.com/react-admin/FunctionField.html): Displays a custom function. Accepts `source`, `label`, and `sortable`.
- [`<ImageField>`](https://marmelab.com/react-admin/ImageField.html): Displays an image. Accepts `source`, `label`, and `sortable`.
- [`<NumberField>`](https://marmelab.com/react-admin/NumberField.html): Displays a number. Accepts `source`, `label`, and `sortable`.
- [`<ReferenceField>`](https://marmelab.com/react-admin/ReferenceField.html): Displays a reference. Accepts `source`, `label`, and `sortable`.
- [`<ReferenceArrayField>`](https://marmelab.com/react-admin/ReferenceArrayField.html): Displays an array of references. Accepts `source`, `label`, and `sortable`.
- [`<ReferenceManyField>`](https://marmelab.com/react-admin/ReferenceManyField.html): Displays many references. Accepts `source`, `label`, and `sortable`.
- [`<ReferenceOneField>`](https://marmelab.com/react-admin/ReferenceOneField.html): Displays one reference. Accepts `source`, `label`, and `sortable`.
- [`<RichTextField>`](https://marmelab.com/react-admin/RichTextField.html): Displays rich text. Accepts `source`, `label`, and `sortable`.
- [`<SelectField>`](https://marmelab.com/react-admin/SelectField.html): Displays a select field. Accepts `source`, `label`, and `sortable`.
- [`<TextField>`](https://marmelab.com/react-admin/TextField.html): Displays text. Accepts `source`, `label`, and `sortable`.
- [`<TranslatableFields>`](https://marmelab.com/react-admin/TranslatableFields.html): Displays translatable fields. Accepts `source`, `label`, and `sortable`.
- [`<UrlField>`](https://marmelab.com/react-admin/UrlField.html): Displays a URL. Accepts `source`, `label`, and `sortable`.
- [`<WrapperField>`](https://marmelab.com/react-admin/WrapperField.html): Wraps other fields. Accepts `source`, `label`, and `sortable`.

### Inputs
- [`<ArrayInput>`](https://marmelab.com/react-admin/ArrayInput.html): Input for arrays. Accepts `source`, `label`, and `validate`.
- [`<AutocompleteInput>`](https://marmelab.com/react-admin/AutocompleteInput.html): Input for autocomplete. Accepts `source`, `label`, and `validate`.
- [`<AutocompleteArrayInput>`](https://marmelab.com/react-admin/AutocompleteArrayInput.html): Input for autocomplete arrays. Accepts `source`, `label`, and `validate`.
- [`<BooleanInput>`](https://marmelab.com/react-admin/BooleanInput.html): Input for booleans. Accepts `source`, `label`, and `validate`.
- [`<CheckboxGroupInput>`](https://marmelab.com/react-admin/CheckboxGroupInput.html): Input for checkbox groups. Accepts `source`, `label`, and `validate`.
- [`<DateInput>`](https://marmelab.com/react-admin/DateInput.html): Input for dates. Accepts `source`, `label`, and `validate`.
- [`<DateTimeInput>`](https://marmelab.com/react-admin/DateTimeInput.html): Input for date and time. Accepts `source`, `label`, and `validate`.
- [`<FileInput>`](https://marmelab.com/react-admin/FileInput.html): Input for files. Accepts `source`, `label`, and `validate`.
- [`<ImageInput>`](https://marmelab.com/react-admin/ImageInput.html): Input for images. Accepts `source`, `label`, and `validate`.
- [`<NullableBooleanInput>`](https://marmelab.com/react-admin/NullableBooleanInput.html): Input for nullable booleans. Accepts `source`, `label`, and `validate`.
- [`<NumberInput>`](https://marmelab.com/react-admin/NumberInput.html): Input for numbers. Accepts `source`, `label`, and `validate`.
- [`<PasswordInput>`](https://marmelab.com/react-admin/PasswordInput.html): Input for passwords. Accepts `source`, `label`, and `validate`.
- [`<RadioButtonGroupInput>`](https://marmelab.com/react-admin/RadioButtonGroupInput.html): Input for radio button groups. Accepts `source`, `label`, and `validate`.
- [`<ReferenceInput>`](https://marmelab.com/react-admin/ReferenceInput.html): Input for references. Accepts `source`, `label`, and `validate`.
- [`<ReferenceArrayInput>`](https://marmelab.com/react-admin/ReferenceArrayInput.html): Input for reference arrays. Accepts `source`, `label`, and `validate`.
- [`<RichTextInput>`](https://marmelab.com/react-admin/RichTextInput.html): Input for rich text. Accepts `source`, `label`, and `validate`.
- [`<SearchInput>`](https://marmelab.com/react-admin/SearchInput.html): Input for search. Accepts `source`, `label`, and `validate`.
- [`<SelectInput>`](https://marmelab.com/react-admin/SelectInput.html): Input for select fields. Accepts `source`, `label`, and `validate`.
- [`<SelectArrayInput>`](https://marmelab.com/react-admin/SelectArrayInput.html): Input for select arrays. Accepts `source`, `label`, and `validate`.
- [`<SimpleFormIterator>`](https://marmelab.com/react-admin/SimpleFormIterator.html): Iterator for simple forms. Accepts `source`, `label`, and `validate`.
- [`<TextInput>`](https://marmelab.com/react-admin/TextInput.html): Input for text. Accepts `source`, `label`, and `validate`.
- [`<TimeInput>`](https://marmelab.com/react-admin/TimeInput.html): Input for time. Accepts `source`, `label`, and `validate`.
- [`<TranslatableInputs>`](https://marmelab.com/react-admin/TranslatableInputs.html): Input for translatable fields. Accepts `source`, `label`, and `validate`. 

For more detailed information, visit the [React Admin Documentation](https://marmelab.com/react-admin/documentation.html).

## Testing

Run the tests by running:

```sh
npm run test
```
It runs both unit and end to end tests.

### Task Management

The TaskList component displays a list of tasks with attributes such as ID, title, description, status, type, priority, and assigned user. The assigned user is displayed using a ReferenceField, which shows the user's name.

The TaskCreate and TaskEdit components allow users to create and edit tasks with various attributes such as title, description, status, type, priority, and assigned user. The assigned user is selected using a ReferenceInput with a SelectInput, which allows users to choose from a list of existing users.

The TaskShow component displays detailed information about a specific task, including its comments. It includes a list of comments sorted from latest to oldest, and a form to add new comments. After a comment is successfully added, the input field is cleared. The comments are displayed using a ReferenceManyField, which shows the related comments for the current task.

These components use the following React Admin components:
- ReferenceField: To display the assigned user's name in the TaskList and TaskShow
- ReferenceInput: To provide a list of users to choose from when assigning a task
- SelectInput: To allow selection of a user from the provided list
- ReferenceManyField: To display the list of comments related to a task
- SimpleForm: To create the form for adding new comments
- Datagrid: To display the list of comments in a table format

This implementation ensures that tasks are always assigned to valid users, provides a user-friendly interface for managing task assignments, and allows users to view and add comments to tasks.

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
} as any;

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
```ts
import { Browser, launch, Page } from "puppeteer";

describe("App", () => {
  const port = process.env.PORT;
  let page: Page;
  let browser: Browser;
  beforeAll(async () => {
    browser = await launch();
    page = await browser.newPage();
    await page.goto(`http://localhost:${port}/`);
  });

  afterAll(async () => {
    await browser.close();
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
