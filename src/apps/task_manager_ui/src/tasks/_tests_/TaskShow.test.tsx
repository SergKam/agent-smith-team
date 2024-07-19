import React from 'react';
import { render, screen } from '@testing-library/react';
import { Resource } from 'react-admin';
import { TaskShow } from '../TaskShow';
import { MockApp } from '../../_mocks_/mockApp';

describe('TaskShow', () => {
  it('renders TaskShow', async () => {
    render(
      <MockApp route={'/tasks/1/show'}>
        <Resource name="tasks" show={TaskShow} />
      </MockApp>,
    );

    await screen.findByText('1');
    await screen.findByText('Task 1');
    await screen.findByText('Description for Task 1');
    await screen.findByText('pending');
    await screen.findByText('medium');
    await screen.findByText('task');
  //  await screen.findByText(''); // Assuming assignedTo is empty for this test
  });
});
