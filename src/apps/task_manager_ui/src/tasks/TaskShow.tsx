import { Show, SimpleShowLayout, TextField, ReferenceField } from 'react-admin';
import { ShowProps } from 'react-admin';

export const TaskShow = ({ resource }: ShowProps) => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <TextField source="status" />
      <TextField source="priority" />
      <TextField source="type" />
      <ReferenceField source="assignedTo" reference="users" label="Assigned To" />
      <TextField source="createdAt" />
      <TextField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);