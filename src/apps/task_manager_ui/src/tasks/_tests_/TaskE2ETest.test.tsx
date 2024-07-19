import React from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { Resource } from 'react-admin';
import { MockApp } from '../../_mocks_/mockApp';
import { TaskCreate } from '../TaskCreate';
import { TaskEdit } from '../TaskEdit';
import { TaskShow } from '../TaskShow';
import { TaskList } from '../TaskList';

describe('Task E2E Tests', () => {
  beforeAll(() => {});
  it('creates a new task', async () => {
    render(
      <MockApp route={'/tasks/create'}>
        <Resource name="tasks" create={TaskCreate} />
      </MockApp>,
    );

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Task' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New Task Description' },
    });

    fireEvent.mouseDown(screen.getByLabelText('Status'));

    fireEvent.click(screen.getByText('Pending'));
    fireEvent.mouseDown(screen.getByLabelText('Priority'));
    fireEvent.click(screen.getByText('Medium'));

    fireEvent.mouseDown(screen.getByLabelText('Type'));
    fireEvent.click(screen.getByText('Task'));

    fireEvent.mouseDown(screen.getByText('Assigned To'));

    //fireEvent.click(screen.getByText('Sergii'));
    fireEvent.click(screen.getByText('Save'));

    await screen.findByText('Element created');
  });

  it('edits an existing task', async () => {
    render(
      <MockApp route={'/tasks/1'}>
        <Resource name="tasks" edit={TaskEdit} />
      </MockApp>,
    );
    expect(await screen.findByLabelText('Id')).toHaveValue('1');
    fireEvent.change(screen.getByRole('textbox', { name: 'Title' }), {
      target: { value: 'Updated Task' },
    });
    fireEvent.click(screen.getByText('Save'));

    await screen.findByText('Element updated');
  });

  it('shows task details', async () => {
    render(
      <MockApp route={'/tasks/1/show'}>
        <Resource name="tasks" show={TaskShow} />
      </MockApp>,
    );

    await screen.findByText('Task 1');
    await screen.findByText('Description for Task 1');
    await screen.findByText('pending');
    await screen.findByText('medium');
    await screen.findByText('task');
    await screen.findByText('Sergii'); // Assuming assignedTo is 12345
  });

  it('lists tasks', async () => {
    render(
      <MockApp route={'/tasks'}>
        <Resource name="tasks" list={TaskList} />
      </MockApp>,
    );

    await screen.findByText('Task 1');
    await screen.findByText('Task 2');
  });
});
