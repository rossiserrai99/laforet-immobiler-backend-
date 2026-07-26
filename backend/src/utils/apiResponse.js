const sendSuccess = (res, statusCode, data = null, message = 'Success', meta = null) => {
  const response = {
    status: 'success',
    message,
  };
  
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;

  res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess
};
