const express = require("express");
// const {getProfile} = require('../../middleware/getProfile');
const {admin} = require("../../controllers");

const router = express.Router();

// router.use(getProfile);

router.get("/best-profession", admin.bestProfession);
router.get("/best-clients", admin.bestClients);

module.exports = {admin: router};
