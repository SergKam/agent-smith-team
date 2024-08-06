import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

const UsersList = () => {

    return (
        <List>
            <Datagrid>
                <TextField source="id" />
                <TextField source="name" />
            </Datagrid>
        </List>
    );
};

export default UsersList;
