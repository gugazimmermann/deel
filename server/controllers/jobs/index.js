const {sequelize} = require("../../model");
const {whereProfile, notFound, badRequest} = require("../../helpers");

const getJobsUnpaid = async (req, res) => {
  const {Job, Contract} = req.app.get("models");
  const unpaidJobs = await Job.findAll({
    where: {paid: {[sequelize.Sequelize.Op.not]: true}},
    include: {
      model: Contract,
      required: true,
      where: {...whereProfile(req.profile.id), status: "in_progress"},
      attributes: [],
    },
  });
  res.json(unpaidJobs);
};

const payJob = async (req, res) => {
  const {Job, Contract, Profile} = req.app.get("models");
  const job = await Job.findOne({
    where: {id: req.params.job_id, paid: {[sequelize.Sequelize.Op.not]: true}},
    include: {
      model: Contract,
      // where: {ClientId: req.profile.id, status: "in_progress"},
      where: {ClientId: req.profile.id},
      include: ["Client", "Contractor"],
    },
  });
  if (!job) return notFound(res);
  if (job.Contract.Client.balance < job.price) return badRequest(res, "Insufficient Funds");
  await sequelize.transaction(async t => {
    await Profile.update(
      {balance: sequelize.literal(`balance - ${job.price}`)},
      {where: {id: job.Contract.ClientId}, transaction: t},
    );
    await Profile.update(
      {balance: sequelize.literal(`balance + ${job.price}`)},
      {where: {id: job.Contract.ContractorId}, transaction: t},
    );
    await job.update({paid: true, paymentDate: new Date()}, {transaction: t});
  });
  res.json({message: "Job Paid"});
};

module.exports = {
  getJobsUnpaid,
  payJob,
};
