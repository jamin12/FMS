const { pool } = require('../middlewares/db');
const { tokenTypes } = require('../config/tokens');
const logger = require('../config/logger');

class Token {
  constructor(token, user, type, expires, blacklisted, timestamp) {
    this.token = token;
    this.user = user;
    this.type = type;
    this.expires = expires;
    this.blacklisted = blacklisted;
    this.timestamp = timestamp;
  }
}

const token_col = ['id', 'token', 'type', 'user', 'backlisted'];

const condition = async (filter) => {
  let where_stmt = '';
  token_col.forEach(col => {
    if (filter[col]) where_stmt += (where_stmt === '' ? '' : ' AND ') + `${col}='${filter[col]}'`;
  });

  logger.debug(JSON.stringify({ filter: JSON.stringify(filter), where_stmt }));

  return where_stmt;
};

const create = async (token) => {
  const con = await pool.getConnection(conn => conn)
  const insert_query = `
  INSERT INTO TOKENS SET ?
  `;
  const select_query = `
  SELECT * FROM TOKENS WHERE token=?`;

  await con.beginTransaction();

  await con.query(insert_query, [token]);
  const [[generatedToken]] = await con.query(select_query, [token.token]);

  await con.commit();
  await con.release();

  return generatedToken;
};

const findOne = async (filter) => {
  const where_stmt = await condition(filter);

  const con = await pool.getConnection(conn => conn)
  const query = `
  SELECT * FROM TOKENS WHERE ${where_stmt}
  `;
  const [[_token]] = await con.query(query);
  await con.release();

  return _token;
};

const remove = async (filter) => {
  const where_stmt = await condition(filter);

  const con = await pool.getConnection(conn => conn)
  const select_query = `
  SELECT * FROM TOKENS WHERE ${where_stmt}`;
  const delete_query = `
  DELETE FROM TOKENS
  WHERE ${where_stmt}
  `;

  await con.beginTransaction();

  const [_token] = await con.query(select_query);
  await con.query(delete_query);

  await con.commit();
  await con.release();

  return _token;
};

module.exports = {
  create,
  findOne,
  remove
};
