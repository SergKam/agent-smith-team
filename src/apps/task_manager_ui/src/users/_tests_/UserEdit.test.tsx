import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { UserEdit } from '../UserEdit';
import { Resource } from 'react-admin';
import { MockApp } from '../../_mocks_/mockApp';

describe('UserEdit', () => {
  it('renders UserEdit', async () => {
    render(
      <MockApp route="/users/12345">
        <Resource name="users" edit={UserEdit} />,
      </MockApp>,
    );
    expect(await screen.findByLabelText('Id')).toHaveValue('12345');
    expect(await screen.findByLabelText('Name')).toHaveValue('Sergii');
  });
});
