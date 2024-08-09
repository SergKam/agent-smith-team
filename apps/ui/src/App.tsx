import {
  Admin,
  Resource,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { Layout } from "./Layout";
import TaskList from "./TaskList";
import { dataProvider } from "./dataProvider";
import UserCreate from "./UserCreate";
import UsersList from "./UsersList";
import TaskCreate from "./TaskCreate";
import TaskEdit from "./TaskEdit";

export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider}>
    <Resource
      name="tasks"
      create={TaskCreate}
      list={TaskList}
      edit={TaskEdit}
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
