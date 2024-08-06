import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import UserCreate from "./UserCreate";
import UsersList from "./UsersList";

export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider}>
    <Resource
      name="tasks"
      list={ListGuesser}
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
