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

/* ----------------------------------- EXAMPLE ------------------------------------ */
/*
export const Ennova = {
  SQL_SELECT: "select",
  SQL_INSERT: "insert into",
  SQL_UPDATE: "update",
  StringUtils: {
    compare: (source, target) => {
      if (source)
        return source.localeCompare(target);
      return NaN;
    }
  },

  SqlUtils: {
    makeExcuteQueryArgument: (body) => {
      let result = {};
      result.params = Ennova.SqlUtils.makeParams(body);

      result.query = Ennova.SqlUtils.makeQueryString(body).join(" ").trim();
      result.query = Ennova.SqlUtils.makeSQLQuery(body, result.query);

      return result;
  },

  getConditions: (params, idx) => {
      return params.whData.conditions[idx] !== undefined ? params.whData.conditions[idx] : "";
    },

  makeQueryString: (params) => {
    return params.whData.fields.map((element, idx) => {
      let conditions = " ";
      if (idx !== params.whData.fields.length - 1) conditions += params.whData.conditions[idx];
      return element + " = ? " + getConditions(params, idx);
    })
  },

  makeParams: (params) => {
    return params.whData.fields.map((element, idx) => params.fields[element]);
  },

  makeSQLQuery: (body, query) => {
    if (body.method === Ennova.SQL_SELECT) {
      return query = `select * from ${body.table} ` + query;
    } else if (body.method === Ennova.SQL_INSERT) {

    } else if (body.method === Ennova.SQL_UPDATE) {

    }
    }
  }
};

//Example : 해당 메소드를 call하는 파일
import { Ennova } from "./utils.js";

const { SQL_SELECT } = Ennova;
const body = {
  method: SQL_SELECT ,
  table: 'tb_users',
  whData: {
    fields: ["id", "password"],
    conditions: ["and"]
  }, 
  fields: {
    id: "xfilecom@gmail.com",
    password: "hi",
  }, 
}

console.log(Ennova.SqlUtils.makeExcuteQueryArgument(body));
*/
