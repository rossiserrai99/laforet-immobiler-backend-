const morgan = require('morgan');

const requestLogger = morgan('dev', {
  skip: (req, res) => process.env.NODE_ENV === 'test'
});

module.exports = requestLogger;
