import { setupApi } from 'reduxful';
import requestAdapter from '../request-adapter';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const apiDesc = {
  createPost: {
    url: `${BASE_URL}/posts`,
    method: 'POST',
    options: {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
};

const apiConfig = { requestAdapter };

const postsApi = setupApi('postsApi', apiDesc, apiConfig);

export default postsApi;
