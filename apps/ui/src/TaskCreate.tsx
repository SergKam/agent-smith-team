import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
  required,
} from "react-admin";
import { RichTextInput } from "ra-input-rich-text";

const TaskCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" validate={required()} />
      <RichTextInput source="description" />
      <SelectInput
        source="status"
        choices={[
          { id: "pending", name: "Pending" },
          { id: "in_progress", name: "In Progress" },
          { id: "completed", name: "Completed" },
        ]}
      />
      <SelectInput
        source="type"
        choices={[
          { id: "story", name: "Story" },
          { id: "task", name: "Task" },
          { id: "question", name: "Question" },
          { id: "bug", name: "Bug" },
        ]}
      />
      <SelectInput
        source="priority"
        choices={[
          { id: "low", name: "Low" },
          { id: "medium", name: "Medium" },
          { id: "high", name: "High" },
          { id: "critical", name: "Critical" },
        ]}
      />
      <ReferenceInput source="assignedTo" reference="users">
        <SelectInput optionText="name" label="Assigned To" validate={required()} />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

export default TaskCreate;
