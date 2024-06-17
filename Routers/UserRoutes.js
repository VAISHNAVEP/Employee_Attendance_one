const express = require("express");
const {
  register,
  login,
  checkin,
  checkout,
  leave,
  employees,
  attendance,
  Teabreakcheckin,
  Teabreakcheckout,
} = require("../Controller/UserController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/checkin", checkin);
router.put("/checkout/:id", checkout);
router.post("/leave", leave);
router.get("/employees", employees);
router.get("/attendance", attendance);
router.post("/timercheckin", Teabreakcheckin);
router.put("/timercheckout/:id", Teabreakcheckout);
module.exports = router;
