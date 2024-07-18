import { Show, SimpleShowLayout, TextField } from 'react-admin';
import { ShowProps } from 'react-admin';

export const UserShow = ({ resource }: ShowProps) => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
    </SimpleShowLayout>
  </Show>
);
