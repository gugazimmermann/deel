const express = require("express");
const {getProfile} = require("../../middleware/getProfile");
const {jobs} = require("../../controllers");

const router = express.Router();

router.use(getProfile);

router.get("/unpaid", jobs.getJobsUnpaid);
router.post("/:job_id/pay", jobs.payJob);

module.exports = {jobs: router};
