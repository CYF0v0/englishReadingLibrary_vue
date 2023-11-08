import { defineMock } from 'vite-plugin-mock-dev-server'

// 请求接口包含的信息
interface RequestOptions {
  query: Record<string, string> // query string parse
  params: Record<string, string> // params parse
  headers: Record<string, string> // request headers
  body: any // request body
}

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

const error = (message: string) => {
  return {
    code: 403,
    message,
  }
}

const ok = (data: any) => {
  return {
    code: 200,
    data,
  }
}

export default defineMock([
  {
    url: '/api/login',
    headers: {
      'Content-Type': 'application/json'
    },
    method: ['POST'],
    body: (request: RequestOptions) => {
      const username = request.body.data.username
      const password = request.body.data.password
      if (!username) {
        return error('请输入用户名')
      }
      if (!password) {
        return error('请输入密码')
      }
      let isRight = false;
      let currentUser = {};
      users.forEach((element) => {
        if (username == element.username && password ==element.password) {
          isRight = true;
          currentUser = element
          return false;
        }
      });
      if (!isRight) {
        return error('用户名或密码输入不正确') 
      }
      return ok(currentUser)
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