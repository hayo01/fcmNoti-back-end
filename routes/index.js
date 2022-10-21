let express = require("express");
let router = express.Router();

let mysql = require("../config/mysqlPool");
let LoginAPI = require("../apis/LoginAPI");

/* GET home page. */
// router.get("/", async (req, res, next) => {
//   let result = await mysql.getUserInfoByUserId("1");
//   res.json(result[0]);
// });

/* Login */
router.post("/login", async (req, res, next) => {
  // let result = await LoginAPI.login(req.body);
  let result = await LoginAPI.loginWithSetQuery(req.body);
  res.send(result);
});

module.exports = router;
