const Stocks = artifacts.require("Stocks");

module.exports = function (deployer) {
  deployer.deploy(Stocks);
};
