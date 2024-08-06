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

## User Creation

A new user can be created using the UserCreate form in the admin interface.
