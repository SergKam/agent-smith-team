import { Edit, SimpleForm, TextInput } from 'react-admin';

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
);