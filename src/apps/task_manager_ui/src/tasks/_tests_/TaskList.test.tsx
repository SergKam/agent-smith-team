import React from 'react';
import { render, screen } from '@testing-library/react';
import { Resource } from 'react-admin';
import { TaskList } from '../TaskList';
import { MockApp } from '../../_mocks_/mockApp';

describe('TaskList', () => {
  it('renders TaskList', async () => {
    render(
      <MockApp route={'/tasks'}>
        <Resource name="tasks" list={TaskList} />
      </MockApp>,
    );

    await screen.findByText('Task 1');
    await screen.findByText('Description for Task 1');
    await screen.findByText('pending');
    await screen.findByText('medium');
    await screen.findByText('Task 2');
    await screen.findByText('Description for Task 2');
    await screen.findByText('in_progress');
    await screen.findByText('high');
  });
});
