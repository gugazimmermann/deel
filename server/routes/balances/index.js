const express = require("express");
const {getProfile} = require("../../middleware/getProfile");
const {balances} = require("../../controllers");

const router = express.Router();

router.use(getProfile);

router.post("/deposit/:userId", balances.deposit);

module.exports = {balances: router};
