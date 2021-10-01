// Controller functions
exports.select_selfie = (req, res) => {
  res.render("selfie-options");
};

exports.filter = (req, res) => {
  res.render("filters");
};

exports.glasses = (req, res) => {
  res.render("glasses");
};

exports.virtual_background = (req, res) => {
  res.render("virtual-background");
};

exports.selfie = (req, res) => {
  res.render("selfie");
};
