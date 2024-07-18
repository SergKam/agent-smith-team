import React from 'react';
import { render, screen } from '@testing-library/react';
import { Resource } from 'react-admin';
import { UserCreate } from '../UserCreate';
import { MockApp } from '../../_mocks_/mockApp';

describe('UserCreate', () => {
  it('renders UserCreate', async () => {
    render(
      <MockApp route={'/users/create'}>
        <Resource name="users" create={UserCreate} />
      </MockApp>,
    );

    await screen.findByLabelText('Name');
    await screen.findByText('Save');
  });
});
