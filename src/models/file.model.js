const validator = require('validator');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const { pool } = require('../middlewares/db');

const file_col = ['id', 'fieldname', 'encoding', 'mimetype', 'destination', 'filename', 'ext', 'filepath', 'bytes', 'created_at', 'updated_at'];

const condition = async (filter) => {
  let where_stmt = '';
  file_col.forEach((col) => {
    if (filter[col]) where_stmt += (where_stmt !== '' ? ' AND ' : '') + `${col}='${filter[col]}'`;
  })
  return where_stmt;
};

const create = async (file) => {
  file.id = uuid();

  const con = await pool.getConnection(conn => conn)
  await con.beginTransaction();
  const insert_query = `
  INSERT INTO files SET ?
  `;
  const select_query = `
  SELECT * FROM files WHERE id=?
  `;
  const result = await con.query(insert_query, [file]);
  const [[inserted_file]] = await con.query(select_query, [file.id]);

  await con.commit();
  await con.release();
  return inserted_file;
};

const findById = async (id) => {
  const con = await pool.getConnection(conn => conn)

  const select_query = `
  SELECT * FROM files WHERE id=?
  `;
  const [[file]] = await con.query(select_query, [id]);

  await con.release();

  return file;
};

const findOne = async (filter) => {
  let where_stmt = await condition(filter);

  const con = await pool.getConnection(conn => conn)

  const select_query = `
  SELECT * FROM files WHERE ${where_stmt} LIMIT 1
  `;
  const [[file]] = await con.query(select_query);

  await con.release();

  return file;
};

const queryFiles = async (filter) => {
  let where_stmt = await condition(filter);

  const con = await pool.getConnection(conn => conn)

  const select_query = `
  SELECT * FROM files WHERE ${where_stmt}
  `;
  const [file] = await con.query(select_query);

  await con.release();

  return file;
};

const update = async (id, file) => {
  const con = await pool.getConnection(conn => conn)
  await con.beginTransaction();

  const update_query = `
  UPDATE files
  SET ?
  WHERE id=?`
  const select_query = `
  SELECT * FROM files WHERE id=?
  `
  const result = await con.query(update_query, [file, id]);
  const [[file_]] = await con.query(select_query, [id]);

  await con.commit();
  await con.release();

  return file_;
};

const remove = async (filter) => {
  const where_stmt = await condition(filter);

  const con = await pool.getConnection(conn => conn)
  const select_query = `
  SELECT * FROM files WHERE ${where_stmt}
  `;
  const delete_query = `
  DELETE FROM files WHERE ${where_stmt}`;

  const [file] = await con.query(select_query);
  const result = await con.query(delete_query);
  await con.release();

  return file;
};

module.exports = {
  create,
  findById,
  findOne,
  queryFiles,
  update,
  remove,
}

