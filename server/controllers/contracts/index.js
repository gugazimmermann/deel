const {sequelize} = require("../../model");
const {whereProfile, notFound} = require("../../helpers");

const getContractById = async (req, res) => {
  const {Contract} = req.app.get("models");
  const contract = await Contract.findOne({
    where: {...whereProfile(req.profile.id), id: req.params.id},
  });
  if (!contract) return notFound(res);
  res.json(contract);
};

const getContractsList = async (req, res) => {
  const {Contract} = req.app.get("models");
  const contracts = await Contract.findAll({
    where: {...whereProfile(req.profile.id), status: {[sequelize.Sequelize.Op.not]: "terminated"}},
  });
  res.json(contracts);
};

module.exports = {
  getContractById,
  getContractsList,
};
