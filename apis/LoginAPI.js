var mysql = require("../config/mysqlPool");

setResponseToSend = async result => {
  console.log(`change Response form > ${result}`);

  let response;
  if (result === 0 || result === undefined || result === null) {
    response = {
      status: "99",
      message: "There is no result. Check your request again",
    };
  } else {
    response = {
      status: "00",
      data: result,
    };
  }

  return response;
};

exports.login = async params => {
  console.log(`LoginAPI > ${params}`);
  let userInfo = await mysql.getUserInfoByUserId(params.userId);
  console.log(userInfo);

  if (
    userInfo !== undefined &&
    (userInfo.token === "" || userInfo.token === undefined)
  ) {
    console.log(`This user doesn't have token yet`);
    await mysql.updateExpoPushToken(params);
    userInfo.token = params.token;
  }

  const response = await setResponseToSend(userInfo);
  console.log("login response >");
  console.log(response);

  return response;
};

/* --------------------------------------------- */
const query = {
  method: "",
  selector: "",
  table: "",
  whData: {
    fields: [],
    conditions: [],
  },
  userInfo: {
    userId: "",
    userPwd: "",
    token: "",
  },
};

const LOGIN_FIELDS = {
  fields: ["userId", "userPwd"],
  conditions: ["AND"],
};

const setLoginFields = params => {
  query.method = "SELECT";
  query.selector = "*";
  query.table = "FROM tb_users";
  query.whData = LOGIN_FIELDS;
  query.userInfo = params;
  return query;
};

exports.loginWithSetQuery = async params => {
  console.log(`LoginAPI_SQ > ${params}`);
  let query = setLoginFields(params);
  let res = await setResponseToSend(
    await mysql.setQueryWithParamsThenSend(query)
  );
  console.log("최종 response >");
  console.log(res);

  return res;
};
