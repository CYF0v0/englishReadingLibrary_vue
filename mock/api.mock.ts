import { defineMock } from 'vite-plugin-mock-dev-server'

const users = [{
  id: 1,
  username: 'admin',
  password: 'admin',
  type: '管理员',
}, {
  id: 2,
  username: 'manager',
  password: 'manager',
  type: '运营人员',
}];

export default defineMock([
  {
    url: '/api/login',
    headers: {
      'Content-Type': 'application/json'
    },
    method: ['POST'],
    body: {
      users,
    }
  },
  {
    url: '/api/user/list',
    headers: {
      'Content-Type': 'application/json'
    },
    method: ['GET'],
    body: {
      users,
    }
  },
])