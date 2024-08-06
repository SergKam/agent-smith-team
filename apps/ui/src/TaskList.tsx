import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

const TaskList = () => {
    return (
        <List>
            <Datagrid>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="description" />
                <TextField source="status" />
                <TextField source="type" />
                <TextField source="priority" />
            </Datagrid>
        </List>
    );
};

export default TaskList;