import React from 'react';
import { render, screen } from '@testing-library/react';
import { Resource } from 'react-admin';
import { TaskCreate } from '../TaskCreate';
import { MockApp } from '../../_mocks_/mockApp';

describe('TaskCreate', () => {
  it('renders TaskCreate', async () => {
    render(
      <MockApp route={'/tasks/create'}>
        <Resource name="tasks" create={TaskCreate} />
      </MockApp>,
    );

    await screen.findByLabelText('Title');
    await screen.findByLabelText('Description');
    await screen.findByLabelText('Status');
    await screen.findByLabelText('Priority');
    await screen.findByLabelText('Type');
    await screen.findByLabelText('Assigned To');
  });
});