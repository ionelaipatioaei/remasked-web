const {Pool} = require("pg");

// edit this when in production
const CON_STR = "postgresql://dbuser:secretpassword@database.server.com:3211/mydb";

const pool = new Pool({
  connectionString: CON_STRl
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }
}