import { fetchUtils } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const apiUrl = 'http://localhost:3000/v1';
const httpClient = fetchUtils.fetchJson;

export const dataProvider = simpleRestProvider(apiUrl, httpClient);
