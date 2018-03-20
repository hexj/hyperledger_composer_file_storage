'use strict';
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const port = 8081;
const app = express();

// settings
/**
 * because you don’t want to make it easy for an attacker to figure what you are
 * running The X-Powered-By header can be extremely useful to an attacker for
 * building a site’s risk profile
 */
app.disable('x-powered-by');

// settings
/**
 * because you don’t want to make it easy for an attacker to figure what you are
 * running The X-Powered-By header can be extremely useful to an attacker for
 * building a site’s risk profile
 */
app.disable('x-powered-by');

app.use(compression());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(helmet());
// using a single line of code will attach 7 protecting middleware to Express
// appapp.use(helmet());
// additional configurations can be applied on demand, this one mislead the
// caller to think we’re using PHP 🙂
app.use(helmet.hidePoweredBy({
  setTo: 'PHP 4.2.0'
}));  // other middleware are not activated by default and requires explicit
      // configuration .
// app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
// app.use(flash());
app.use('*', function(req, res, next) {
  // logger.debug(`URL: ${req.baseUrl}`);
  next();
});

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use((err, req, res, next) => {
  if (err) {
    res.json(err);
  }
});


app.use('/api/v0', require(`./modules/v0/users/routes.js`));

app.listen(port)
    .on('error',
        error => {
            // logger.error(error);
        })
    .on('listening', () => {
      console.log(`Express listening on ${port}`);
      // logger.info(`Express listening on ${port}`);
    });
