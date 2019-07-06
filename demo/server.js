const Koa = require('koa')
const router = require('koa-router')()
const app = new Koa()
const cors= require('koa2-cors')
app.use(cors({
    origin: function (ctx) {
        if (ctx.url === '/cors') {
            return "*"; // 允许来自所有域名请求
        }
        return 'http://localhost:5500';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'], //设置允许的HTTP请求类型
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  }))
app.use((ctx,next)=>{
    console.log(ctx.method,ctx.url)
    next()
})
router.get('/api/book',async(ctx,next)=>{
    var data = {
        name:'book1',
        pages:10
    }
    ctx.body = data
})
app.use(router.routes())
app.listen(3000)
console.log('server listening in 3000')