import React from 'react';
import { Admin, LayoutComponent, TestMemoryRouter } from 'react-admin';
import fakeRestDataProvider from 'ra-data-fakerest';
import fs from 'node:fs';
import path from 'node:path';
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../_mocks_/data.json'), 'utf-8'),
);
const dataProvider = fakeRestDataProvider(data);
const layout: LayoutComponent = ({ children }) => <div>{children}</div>;

type Props = {
  children: React.ReactNode;
  route: string;
};

export const MockApp = ({ children, route }: Props) => (
  <TestMemoryRouter initialEntries={[route]}>
    <Admin dataProvider={dataProvider}>{children}</Admin>
  </TestMemoryRouter>
);
