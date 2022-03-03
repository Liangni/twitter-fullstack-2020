// 此為測試檔指定的身分驗證helpers存放路徑，若搬動會造成測試失敗

function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}


module.exports = {
  ensureAuthenticated,
  getUser
};