import React from 'react';
import { render, screen } from '@testing-library/react';
import { Resource } from 'react-admin';
import { UserShow } from '../UserShow';
import { MockApp } from '../../_mocks_/mockApp';

describe('UserShow', () => {
  it('renders UserShow', async () => {
    render(
      <MockApp route={'/users/12345/show'}>
        <Resource name="users" show={UserShow} />
      </MockApp>,
    );

    await screen.findByText('12345');
    await screen.findByText('Sergii');
  });
});
