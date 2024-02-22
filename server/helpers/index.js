const {sequelize} = require("../model");

const whereProfile = profileId => ({
  [sequelize.Sequelize.Op.or]: [{ClientId: profileId}, {ContractorId: profileId}],
});

const whereDatesAndPaid = (start, end, paid) => ({
  paymentDate: {[sequelize.Sequelize.Op.between]: [new Date(start), new Date(end)]},
  paid,
});

const notFound = res => res.status(404).send({error: "Not Found"});
const badRequest = (res, message) => res.status(400).send({error: message});

module.exports = {
  whereProfile,
  whereDatesAndPaid,
  notFound,
  badRequest,
};
