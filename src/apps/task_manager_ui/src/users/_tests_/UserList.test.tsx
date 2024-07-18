import React from 'react';
import { render, screen } from '@testing-library/react';
import { Resource } from 'react-admin';
import { UserList } from '../UserList';
import { MockApp } from '../../_mocks_/mockApp';

describe('UserList', () => {
  it('renders UserList', async () => {
    render(
      <MockApp route={'/users'}>
        <Resource name="users" list={UserList} />
      </MockApp>,
    );

    await screen.findByText('12345');
    await screen.findByText('Sergii');
    await screen.findByText('User 2');
  });
});
