const validator = require('validator');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const { pool, transaction } = require('../middlewares/db');
const pick = require('../utils/pick');
const logger = require('../config/logger');


const hello = async (body) => {
  let result;
  const query = `
    SELECT @@global.time_zone, @@session.time_zone
      SET time_zone='Asia/Seoul'
    SELECT b.name, a.time_zone_id
    FROM mysql.time_zone a, mysql.time_zone_name b
    WHERE a.time_zone_id = b.time_zone_id AND b.name LIKE '%Seoul'
    `;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    [result] = await conn.query(query);
    logger.debug(result);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.release();
  }

  return result;
};


module.exports = {
  hello
};
