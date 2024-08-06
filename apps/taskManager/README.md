# Task Manager Application

## Project Structure

The project follows:

- a domain-driven design (DDD)
- clean architecture principles
- API First approach using OpenAPI specification

The main directories and files are structured as follows:

  - **database**: Database connection and schema initialization.
  - **middleware**: Express middleware functions.
  - **domain**: Contains domain-specific logic and models.
    - **user**: User domain.
      - **models**: TypeScript interfaces and enums representing the user domain models.
      - **repositories**: Data access layer for interacting with the user database.
      - **services**: Business logic layer for user domain.
      - **api/actions**: API route handlers for user domain.
    - **task**: Task domain.
      - **models**: TypeScript interfaces and enums representing the task domain models.
      - **repositories**: Data access layer for interacting with the task database.
      - **services**: Business logic layer for task domain.
      - **api/actions**: API route handlers for task domain.
  - **types**: Type definitions generated from the OpenAPI specification.
  - **shared**: Shared resources across different applications.
    - **api.yaml**: OpenAPI specification for the API.
    
  - **server.ts**: Entry point for the Task Manager application.

## Used Technologies

- **TypeScript**: Strongly typed programming language that builds on JavaScript.
- **Express**: Web framework for Node.js.
- **MySQL**: Relational database management system.
- **Jest**: JavaScript testing framework.
- **Supertest**: Library for testing Node.js HTTP servers.
- **dotenv**: Module to load environment variables from a .env file.
- **express-openapi**: Middleware for building APIs using OpenAPI specification.
  It is used to define the API routes using the OpenAPI
  specification in `shared/api.yaml`.
  The middleware automatically validates the request payloads against the OpenAPI schema.
  There is no need to write separate validation logic for the input parameter/payload types
  and presents of required parameters.
- **openapi-typescript**: Tool to generate TypeScript types from OpenAPI specifications.
  The TypeScript types are generated from the OpenAPI specification and used throughout the application.
- **winston**: Logger module based on winston (exported from `src/apps/taskManager/middleware/logger`)


## Common Patterns

- **Repository Pattern**: Used to abstract the data access layer.
- **Service Pattern**: Encapsulates business logic and interacts with repositories.
- **Middleware**: Used for error handling and other cross-cutting concerns.
- **Model-View-Controller (MVC)**: Separation of concerns between data models, business logic, and API routes.

## Useful Commands

- **Start the application**: `npm run start`
- **Run the application in development mode**: `npm run dev`
- **Generate TypeScript types from OpenAPI spec**: `npm run generate-types` (run this command after updating the OpenAPI spec in `shared/api.yaml`)
- **Run MySQL in Docker**: `npm run mysql`
- **Run tests**: `npm test`
- **Compile TypeScript**: `npm run tsc`
- **Format code with Prettier**: `npm run format`
- **Clean compiled JavaScript files**: `npm run clean`

## Key Naming Conventions

- **Interfaces and Types**: Use PascalCase (e.g., `User`, `Task`).
- **Enums**: Use PascalCase (e.g., `TaskStatus`, `TaskType`).
- **Functions and Variables**: Use camelCase (e.g., `getUserById`, `createTask`).
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `DB_HOST`, `PORT`).

## Architecture

The application is designed using domain-driven design (DDD) and clean architecture principles. The main components are:

- **Models**: Represent the domain entities and enums.
- **Repositories**: Handle data access and database interactions.
- **Services**: Contain business logic and interact with repositories.
- **API Handlers**: Define the API routes and handle HTTP requests and responses.
- **Middleware**: Handle cross-cutting concerns like error handling.
- **Database**: Initialize and manage database connections and schema.
- **Types**: Generated TypeScript types from the OpenAPI specification.

## Testing

The project uses Jest for unit and API testing. Test files are located alongside the files they test and follow the naming convention `*.test.ts`.

_Note_: The tests require a running MySQL database. You can start a MySQL instance using the `npm run mysql` command.

_Warning_:  
 In jest `expect(...).rejects.toThrow(..)` doesn't work use `expect(...).rejects.toBeInstanceOf(...)` instead.

## Environment Variables

The application uses `dotenv` to load environment variables from a `.env` file. Key environment variables include:

- `DB_HOST`: Database host.
- `DB_USER`: Database user.
- `DB_PASSWORD`: Database password.
- `DB_NAME`: Database name.
- `PORT`: Port on which the server runs.

## Database Schema

The database schema is defined in `src/apps/task_manager/database/schema.sql` and includes tables for users, tasks, task relations, and comments.
