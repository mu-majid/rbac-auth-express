exports.notFound = (req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
};

exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
};