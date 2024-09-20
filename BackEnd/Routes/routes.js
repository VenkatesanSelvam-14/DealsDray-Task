const express = require("express");
const router = express.Router();
const authcontrollers = require("../Controllers/controller");
const { jwtAuthMiddleware } = require("../jwt");

// routes
router.route("/login").post(authcontrollers.login);
router.route("/refresh").post(jwtAuthMiddleware, authcontrollers.refresh);
router.route("/createEmployee").post(jwtAuthMiddleware, authcontrollers.createEmployee);
router.route("/addLoginUser").post(authcontrollers.addLoginUser);

router.route("/searchEmployee").get(jwtAuthMiddleware, authcontrollers.searchEmployee);
router.route("/chooseEmployee/:id").get(jwtAuthMiddleware, authcontrollers.chooseEmployee);
router.route("/showAllEmployee").get(jwtAuthMiddleware, authcontrollers.showAllEmployee);

router.route("/editEmployee").put(jwtAuthMiddleware, authcontrollers.editEmployee);
router.route("/logout").put(jwtAuthMiddleware, authcontrollers.logout);

router.route("/deleteEmployee").delete(jwtAuthMiddleware, authcontrollers.deleteEmployee);



module.exports = router;
