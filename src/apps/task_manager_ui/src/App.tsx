import { Admin, ListGuesser, Resource } from 'react-admin';
import { Layout } from './Layout';
import { dataProvider } from './dataProvider';
import { UserList } from './users/UserList';
import { UserEdit } from './users/UserEdit';
import { UserCreate } from './users/UserCreate';
import { UserShow } from './users/UserShow';

export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider}>
    <Resource name="tasks" list={ListGuesser} />
    <Resource
      name="users"
      list={UserList}
      edit={UserEdit}
      create={UserCreate}
      show={UserShow}
    />
  </Admin>
);
