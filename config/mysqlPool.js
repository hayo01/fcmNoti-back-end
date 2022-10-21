const mysqlConfig = require("./mysqlConfig").mysqlConfig;
const mysql = require("mariadb");

const pool = mysql.createPool(mysqlConfig);

exports.getUserInfoByUserId = async userId => {
  console.log(`mysqlPool > ${userId}`);
  let result = await pool.query(
    "SELECT * FROM tb_users WHERE userId = ?",
    userId
  );
  console.log(`mysqlPool > result > ${result[0]}`);
  return result[0];
};

exports.updateExpoPushToken = async userInfo => {
  console.log(`mysqlPool >`);
  console.log(userInfo);
  let result = await pool.query(
    "UPDATE tb_users SET token = ? WHERE userId = ?",
    [userInfo.token, userInfo.userId]
  );
  console.log(`affectedRows > ${result.affectedRows}`);
  return result.affectedRows;
};

//하나의 쿼리로 모든 서버통신을 해결하자! >> 완료
exports.setQueryWithParamsThenSend = async params => {
  console.log("** Query Making **");
  console.log(params);

  let req = {
    query: [],
    data: [],
  };

  /* WHERE절 만들기 */
  let whereArr = ["WHERE"];
  params.whData.fields.map((ele, idx) => {
    let temp =
      idx < params.whData.fields.length - 1
        ? ele + " =? " + params.whData.conditions
        : ele + " =? ";
    whereArr.push(temp);
    req.data.push(params.userInfo[ele]); /* data 넣어주기 */
  });
  let whereStr = whereArr.join(" ");

  /* Query 만들기 */
  let queryArr = [params.method, params.selector, params.table, whereStr];
  req.query = queryArr.join(" ");
  console.log(req.query);

  /* DB 서버 통신 */
  let response;
  try {
    response = await pool.query(req.query, req.data);
    console.log("test:" + response);
  } catch (e) {
    console.error(e);
  }

  return response[0];
};
