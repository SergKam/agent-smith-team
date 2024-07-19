import React from 'react';
import { render, screen } from '@testing-library/react';
import { Resource } from 'react-admin';
import { TaskEdit } from '../TaskEdit';
import { MockApp } from '../../_mocks_/mockApp';

describe('TaskEdit', () => {
  it('renders TaskEdit', async () => {
    render(
      <MockApp route="/tasks/1">
        <Resource name="tasks" edit={TaskEdit} />
      </MockApp>,
    );

    expect(await screen.findByLabelText('Id')).toHaveValue('1');
    expect(await screen.findByLabelText('Title')).toBeInTheDocument();
    expect(await screen.findByLabelText('Description')).toBeInTheDocument();
    expect(await screen.findByLabelText('Status')).toBeInTheDocument();
    expect(await screen.findByLabelText('Priority')).toBeInTheDocument();
    expect(await screen.findByLabelText('Type')).toBeInTheDocument();
    expect(await screen.findByLabelText('Assigned To')).toBeInTheDocument();
  });
});