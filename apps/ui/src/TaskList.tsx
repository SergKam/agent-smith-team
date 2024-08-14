import React from "react";
import { List, Datagrid, TextField, ReferenceField } from "react-admin";

const TaskList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="status" />
        <TextField source="type" />
        <TextField source="priority" />
        <ReferenceField source="assignedTo" reference="users">
          <TextField source="name" />
        </ReferenceField>
      </Datagrid>
    </List>
  );
};

export default TaskList;
