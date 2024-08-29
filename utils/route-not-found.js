exports.routeNotFound = (req, res) => {
  res.end(`Cannot ${req.method} ${req.path}`);
};
