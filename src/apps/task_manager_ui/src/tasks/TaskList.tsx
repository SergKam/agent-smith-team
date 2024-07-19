import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  ReferenceField,
} from 'react-admin';

export const TaskList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <TextField source="status" />
      <TextField source="priority" />
      <TextField source="type" />
      <ReferenceField source="assignedTo" reference="users" label="Assigned To" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);