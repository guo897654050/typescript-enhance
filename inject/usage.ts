import http from 'http';
import {
  Get, Post, Controller, routerFactory
} from './inject'


@Controller('/User')
class UserProfile {
  @Get('/list')
  async UserList() {
    return {
      success: true,
      code: 200,
      data: [
        {
          name: 'guo',
          age: 30
        },
        {
          name: 'guo-test',
          age: 32
        },
      ]
    }
  }

  @Post('/add')
  async add() {
    return {
      success: true,
      code: 200
    }
  }
}


const userProfile = new UserProfile()
console.log('useprofile', userProfile)
const collect = routerFactory(userProfile)
console.log('after decorator collect data:', collect)


http.createServer((req, res) => {
  for (const info of collect) {
    if (req.url === info.path && req.method === info.requestMethod.toLocaleUpperCase()) {
      info.requestHandler().then((data) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data))
      })
    }
  }
})
  .listen(3000)
  .on('listening', () => {
    console.log('Server ready at http://localhost:3000 \n');
    console.log('GET /user/list at http://localhost:3000/user/list \n');
    console.log('POST /user/add at http://localhost:3000/user/add \n');
  })