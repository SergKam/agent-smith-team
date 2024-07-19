import { Edit, SimpleForm, TextInput, SelectInput, ReferenceInput } from 'react-admin';

const priorities = [
  { id: 'low', name: 'Low' },
  { id: 'medium', name: 'Medium' },
  { id: 'high', name: 'High' },
  { id: 'critical', name: 'Critical' },
];

const statuses = [
  { id: 'pending', name: 'Pending' },
  { id: 'in_progress', name: 'In Progress' },
  { id: 'completed', name: 'Completed' },
];

const types = [
  { id: 'story', name: 'Story' },
  { id: 'task', name: 'Task' },
  { id: 'question', name: 'Question' },
  { id: 'bug', name: 'Bug' },
];

export const TaskEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="title" />
      <TextInput source="description" />
      <SelectInput source="status" choices={statuses} />
      <SelectInput source="priority" choices={priorities} />
      <SelectInput source="type" choices={types} />
      <ReferenceInput source="assignedTo" reference="users">
        <SelectInput optionText="name" label="Assigned To" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);