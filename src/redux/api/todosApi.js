import { setupApi } from 'reduxful';
import requestAdapter from '../request-adapter';

const apiDesc = {
  getTodos: {
    url: '/api/todos',
    method: 'GET'
  },
  createTodo: {
    url: '/api/todos',
    method: 'POST',
    options: {
      headers: { 'Content-Type': 'application/json' }
    }
  },
  updateTodo: {
    url: '/api/todos/:id',
    method: 'PUT',
    options: {
      headers: { 'Content-Type': 'application/json' }
    }
  },
  deleteTodo: {
    url: '/api/todos/:id',
    method: 'DELETE'
  }
};

const todosApi = setupApi('todosApi', apiDesc, { requestAdapter });

export default todosApi;
