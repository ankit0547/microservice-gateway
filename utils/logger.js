const log4js = require("log4js");
log4js.configure({
  appenders: { errors: { type: "file", filename: "errors.log" } },
  categories: { default: { appenders: ["errors"], level: "error" } }
});

module.exports = log4js.getLogger('errors')