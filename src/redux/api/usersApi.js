import { setupApi } from 'reduxful';
import requestAdapter from '../request-adapter';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const apiDesc = {
  getUsers: {
    url: `${BASE_URL}/users`,
    method: 'GET'
  },
  getUser: {
    url: `${BASE_URL}/users/:userId`,
    method: 'GET'
  },
  getUserPosts: {
    url: `${BASE_URL}/users/:userId/posts`,
    method: 'GET'
  }
};

const apiConfig = { requestAdapter };

const usersApi = setupApi('usersApi', apiDesc, apiConfig);

export default usersApi;
