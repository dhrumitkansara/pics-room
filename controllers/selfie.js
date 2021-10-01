// Controller functions
exports.select_selfie = (req, res) => {
  res.render("selfieOptions");
};

exports.filter = (req, res) => {
  res.render("filters");
};

exports.glasses = (req, res) => {
  res.render("glasses");
};

exports.virtual_background = (req, res) => {
  res.render("virtualBackground");
};

exports.selfie = (req, res) => {
  res.render("selfie");
};
