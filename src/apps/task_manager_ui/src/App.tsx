import { Admin, ListGuesser, Resource } from 'react-admin';
import { Layout } from './Layout';
import { dataProvider } from './dataProvider';
import { UserList } from './users/UserList';
import { UserEdit } from './users/UserEdit';
import { UserCreate } from './users/UserCreate';
import { UserShow } from './users/UserShow';
import { TaskList } from './tasks/TaskList';
import { TaskEdit } from './tasks/TaskEdit';
import { TaskCreate } from './tasks/TaskCreate';
import { TaskShow } from './tasks/TaskShow';

export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider}>
    <Resource name="tasks" list={TaskList} edit={TaskEdit} create={TaskCreate} show={TaskShow} />
    <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} show={UserShow} />
  </Admin>
);
