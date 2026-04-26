const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ],
});

const errorHandler = (err, req, res, next) => {
  const requestId = uuidv4();
  logger.error({
    message: err.message,
    stack: err.stack,
    requestId,
    path: req.path,
    method: req.method
  });

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    request_id: requestId
  });
};

module.exports = errorHandler;
