exports.JSONToObject = (jsonSting) => {
  try {
    return JSON.parse(jsonSting);
  } catch (err) {
    return jsonSting;
  }
};
