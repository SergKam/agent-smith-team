import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { Layout } from "./Layout";
import TaskList from "./TaskList";
import { dataProvider } from "./dataProvider";
import UserCreate from "./UserCreate";
import UsersList from "./UsersList";
import TaskCreate from "./TaskCreate";

export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider}>
    <Resource
      name="tasks"
      create={TaskCreate}
      list={TaskList}
      edit={EditGuesser}
      show={ShowGuesser}
    />
    <Resource
      name="users"
      list={UsersList}
      edit={EditGuesser}
      show={ShowGuesser}
      create={UserCreate}
    />
  </Admin>
);
