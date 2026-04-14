import { makeFetchAdapter } from 'reduxful';

const fetchAdapter = makeFetchAdapter(fetch, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export default fetchAdapter;
