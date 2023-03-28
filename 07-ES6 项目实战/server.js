const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const PORT = 3002;
const app = express();
const config = require('./webpack.config');
const compiler = webpack(config);

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  })
);

function apiHandler() {

  const getRandomTime = (ms = 1000) => {
    return Math.floor(Math.random() * ms)
  }

  const router = express.Router();

  router.get('/token', (req, res) => {
    setTimeout(() => {
      res.send({
        token: '123456'
      })
    }, getRandomTime(600));
  })

  router.get('/tabs', (req, res) => {
    setTimeout(() => {
      res.send([
        {
          id: '1',
          name: '生活'
        },
        {
          id: '2',
          name: '科技'
        },
        {
          id: '3',
          name: '体育'
        }
      ])
    }, getRandomTime());
  })

  router.get('/news/list', (req, res) => {
    setTimeout(() => {
      req.send(require('./mock/news-list.json'))
    }, getRandomTime(800));
  })

  return router;
}

app.use('/app', function (req, res, next) {
  if (req.path === '/token' || req.header.token === '123456') {
    next();
  } else {
    next('invalid token');
  }
})

app.use('/api', apiHandler());

app.use('/app', function (err, req, res, next) {
  res.send({
    error: 1,
    message: err,
  })
})

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!\n`);
})