import React from 'react';
import { Create, SimpleForm, TextInput, required } from 'react-admin';

const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" validate={required()} />
        </SimpleForm>
    </Create>
);

export default UserCreate;