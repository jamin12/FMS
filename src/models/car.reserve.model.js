const validator = require('validator');
const { v4: uuid } = require('uuid');
const { pool, transaction } = require('../middlewares/db');
const pick = require('../utils/pick');

// car_bas랑 join한 정보들
const findAllJoinCBbyUserId = async (user_id) => {
  const con = await pool.getConnection(async (conn) => conn);
  const query = `
  SELECT 
    cb.car_no, 
    cb.car_nm, 
    cb.car_model_nm, 
    cb.car_color,
    cr.id        as reserve_id,
    cr.user_id,
    cr.start_reserve,
    cr.end_reserve
  FROM car_bas cb 
    left join car_reserve cr on cb.car_id = cr.car_id
  WHERE cr.user_id = ?
  `;
  const [reserve_info] = await con.query(query, [user_id]);
  await con.release();

  return reserve_info;
};

const findAllJoinCB = async () => {
  const con = await pool.getConnection(async (conn) => conn);
  const query = `
  SELECT 
    cb.car_no, 
    cb.car_nm, 
    cb.car_model_nm, 
    cb.car_color,
    cr.id        as reserve_id,
    cr.user_id,
    cr.start_reserve,
    cr.end_reserve
  FROM car_bas cb 
    left join car_reserve cr on cb.car_id = cr.car_id
  `;
  const [reserve_info] = await con.query(query);
  await con.release();

  return reserve_info;
};

// car_bas랑 join한 정보들
const findOneJoinCB = async (reserve_id) => {
  const con = await pool.getConnection(async (conn) => conn);
  const query = `
  SELECT 
    cb.car_no, 
    cb.car_nm, 
    cb.car_model_nm, 
    cb.car_color,
    cr.id        as reserve_id,
    cr.user_id,
    cr.start_reserve,
    cr.end_reserve
  FROM car_bas cb 
    left join car_reserve cr on cb.car_id = cr.car_id
  WHERE cr.id = ?
  `;
  const [reserve_info] = await con.query(query, [reserve_id]);
  await con.release();

  return reserve_info;
};

// reserve단독 정보들
const findAll = async () => {
  const con = await pool.getConnection(async (conn) => conn);
  const query = `
  SELECT *
  FROM car_reserve
  `;
  const [reserve_info] = await con.query(query);
  await con.release();

  return reserve_info;
};

// reserve 가장 최신 정보 하나
const findOne = async () => {
  const con = await pool.getConnection(async (conn) => conn);
  const query = `
  SELECT *
  FROM car_reserve order by id desc limit 1
  `;
  const [[reserve_info]] = await con.query(query);
  await con.release();

  return reserve_info;
};

// reserve id로 정보 찾기
const findOneById = async (reserve_id) => {
  const con = await pool.getConnection(async (conn) => conn);
  const query = `
  SELECT *
  FROM car_reserve
  WHERE id = ?
  `;

  const [[reserve_info]] = await con.query(query, [reserve_id]);
  await con.release();

  return reserve_info;
};

// create reserve
const crateReserve = async (car_id, update_body) => {
  const con = await pool.getConnection(async (conn) => conn);
  update_body.car_id = car_id;
  const query = `
  INSERT INTO car_reserve SET ?
  `
  await con.query(query, [update_body]);
  await con.release();

  return await findOne();
}

// delete reserve
const deleteReserve = async (reserve_id, user_id) => {
  const con = await pool.getConnection(async (conn) => conn);
  const query = `
    DELETE FROM car_reserve
    WHERE id = ? AND user_id = ?
  `
  const result = findOneById(reserve_id);

  await con.query(query, [reserve_id, user_id]);
  await con.release();


  return result;
};
// update reserve
const updateReserve = async (reserve_id, user_id, update_body) => {
  const con = await pool.getConnection(async (conn) => conn);
  const query = `
    UPDATE car_reserve
    SET ?
    WHERE id = ? AND user_id = ?
  `
  
  await con.query(query, [update_body, reserve_id, user_id]);
  await con.release();
  
  const result = findOneJoinCB(reserve_id);

  return result;
};


module.exports = {
  findAllJoinCBbyUserId,
  findAll,
  crateReserve,
  deleteReserve,
  updateReserve,
  findAllJoinCB,
  findOneJoinCB,
  findOne,
};
