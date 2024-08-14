import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  ReferenceField,
  ReferenceManyField,
  Datagrid,
  Create,
  SimpleForm,
  TextInput,
  useRecordContext,
  useGetIdentity,
  useNotify,
  useRefresh,
  Button,
} from "react-admin";
import { useCreate } from "react-admin";
import { useForm } from 'react-hook-form';
const TaskShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="title" />
      <TextField source="description" />
      <TextField source="status" />
      <TextField source="type" />
      <TextField source="priority" />
      <ReferenceField source="assignedTo" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <CommentList />
    </SimpleShowLayout>
  </Show>
);

const CommentList = () => {
  const record = useRecordContext();
  return (
    <>
      <h3>Comments</h3>
      <CreateComment />
      <ReferenceManyField
        reference="comments"
        target="taskId"
        sort={{ field: "createdAt", order: "DESC" }}
      >
        <Datagrid bulkActionButtons={false}>
          <ReferenceField source="userId" reference="users">
            <TextField source="name" />
          </ReferenceField>
          <TextField source="content" />
          <DateField source="createdAt" showTime />
        </Datagrid>
      </ReferenceManyField>
    </>
  );
};

const CreateComment = () => {
  const record = useRecordContext();
  const { identity } = useGetIdentity();
  const [create] = useCreate();
  const notify = useNotify();
  const refresh = useRefresh();
  const { reset } = useForm({
    defaultValues: { content: '' }
  });
  const handleSubmit = async (values: any) => {
    try {
      await create("comments", {
        data: { ...values, taskId: record?.id, userId: identity?.id || 271 },
      });
      notify("Comment added successfully");
      refresh();
      reset();
      return true;
    } catch (error) {
      notify("Error: comment not added", { type: "error" });
    }
  };

  return (
    <Create resource="comments">
      <SimpleForm onSubmit={handleSubmit} >
        <TextInput source="content" fullWidth multiline  />
      </SimpleForm>
    </Create>
  );
};

export default TaskShow;
