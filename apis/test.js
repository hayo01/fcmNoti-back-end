const mysqlConfig = require("../config/mysqlConfig").mysqlConfig;
const mysql = require("mariadb");

const pool = mysql.createPool(mysqlConfig);

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

const query = {
  method: "SELECT",
  selector: "*",
  table: "FROM tb_users",
  whData: {
    fields: ["userId", "userPwd"],
    conditions: ["AND"],
  },
  userInfo: {
    userId: "1",
    userPwd: "1",
    token: "totototototototototot",
  },
};

async function callTest(that) {
  console.log(await that.setQueryWithParamsThenSend(query));
}

callTest(this);
