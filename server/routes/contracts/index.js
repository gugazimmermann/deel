const express = require("express");
const {getProfile} = require("../../middleware/getProfile");
const {contracts} = require("../../controllers");

const router = express.Router();

router.use(getProfile);

router.get("/:id", contracts.getContractById);
router.get("/", contracts.getContractsList);

module.exports = {contracts: router};
