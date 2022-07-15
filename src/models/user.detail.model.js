const { pool, transaction } = require('../middlewares/db');

const create = async (userDetail) => {
  const query = `
  INSERT INTO user_details SET ?`;
  const select_query = `
  SELECT * FROM user_details WHERE id=?`;
  let details;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(query, userDetail);
    [[details]] = await conn.query(select_query, [userDetail.id]);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.release();
  }

  return details;
};

const findById = async (id) => {
  const conn = await pool.getConnection(async conn => conn);
  const select_query = `
  SELECT * FROM user_details WHERE id=?`;

  const [[details]] = await conn.query(select_query, [id]);

  await conn.release();

  return details;
};

const save = async (userDetail, id) => {
  let details;

  const query = `
  UPDATE user_details SET ? WHERE id=?`;
  const select_query = `
  SELECT * FROM user_details WHERE id=?`;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(query, [userDetail, id]);
    [[details]] = await conn.query(select_query, [id]);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.release();
  }

  return details;
};

const remove = async (id) => {
  let details;
  const delete_query = `
  DELETE FROM user_details WHERE id=?`;
  const select_query = `
  SELECT * FROM user_details WHERE id=?`;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    [[details]] = await conn.query(select_query, [id]);
    await conn.query(delete_query, [id]);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.release();
  }

  return details;
};

module.exports = {
  create,
  findById,
  save,
  remove
};
