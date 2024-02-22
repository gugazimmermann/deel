const {sequelize} = require("../../model");
const {whereDatesAndPaid, notFound} = require("../../helpers");

const bestProfession = async (req, res) => {
  const {Job, Contract, Profile} = req.app.get("models");
  const {start, end} = req.query;
  const bestProfession = await Job.findAll({
    where: whereDatesAndPaid(start, end, true),
    include: {
      model: Contract,
      attributes: [],
      include: {
        model: Profile,
        as: "Contractor",
        attributes: ["profession"],
      },
    },
    attributes: [
      [sequelize.fn("sum", sequelize.col("price")), "total"],
      [sequelize.col("Contract.Contractor.profession"), "profession"],
    ],
    group: ["Contract.Contractor.profession"],
    order: [[sequelize.fn("sum", sequelize.col("price")), "DESC"]],
    limit: 1,
    raw: true,
  });
  if (bestProfession.length === 0) return notFound(res);
  // res.json(
  //   bestProfession.map(p => ({
  //     profession: p.profession,
  //     total: p.total,
  //   })),
  // );
  res.json({
    profession: bestProfession[0].profession,
    total: bestProfession[0].total,
  });
};

const bestClients = async (req, res) => {
  const {Job, Contract, Profile} = req.app.get("models");
  const {start, end} = req.query;
  let {limit} = req.query;
  limit = limit ? parseInt(limit, 10) : 2;
  const bestClients = await Job.findAll({
    where: whereDatesAndPaid(start, end),
    include: [
      {
        model: Contract,
        attributes: [],
        include: [
          {
            model: Profile,
            as: "Client",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      },
    ],
    attributes: [
      [sequelize.fn("sum", sequelize.col("price")), "paid"],
      [
        sequelize.fn(
          "concat",
          sequelize.col("Contract->Client.firstName"),
          " ",
          sequelize.col("Contract->Client.lastName"),
        ),
        "fullName",
      ],
    ],
    group: ["Contract->Client.id"],
    order: [[sequelize.fn("sum", sequelize.col("price")), "DESC"]],
    limit: limit,
    raw: true,
  });
  const response = bestClients.map(client => ({
    id: client["Contract.Client.id"],
    fullName: client.fullName,
    paid: parseFloat(client.paid).toFixed(2),
  }));
  res.json(response);
};

module.exports = {
  bestProfession,
  bestClients,
};
