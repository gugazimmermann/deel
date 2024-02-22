const {sequelize} = require("../../model");
const {badRequest} = require("../../helpers");

const deposit = async (req, res) => {
  const {Profile, Contract, Job} = req.app.get("models");
  if (req.profile.id !== parseInt(req.params.userId, 10) || req.profile.type !== "client") return res.status(403).send({error: "Forbidden"});
  if (!req.body.amount)  return badRequest(res, "Missing Amount");
  const totalUnpaid = await Job.sum("price", {
    where: {paid: {[sequelize.Sequelize.Op.not]: true}},
    include: [{model: Contract, where: {ClientId: req.profile.id, status: "in_progress"}, required: true}],
  });
  if (parseInt(req.body.amount, 10) > totalUnpaid * 0.25)
    return badRequest(res, "Deposit exceeds 25% of total unpaid jobs.");
  await Profile.update({balance: sequelize.literal(`balance + ${req.body.amount}`)}, {where: {id: req.params.userId}});
  const updatedProfile = await Profile.findByPk(req.params.userId);
  res.json({newBalance: updatedProfile.balance});
};

module.exports = {
  deposit,
};
