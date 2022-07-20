const validator = require('validator');
const { v4: uuid } = require('uuid');
const { pool, transaction } = require('../middlewares/db');
const pick = require('../utils/pick');

// car_bas랑 join한 정보들
const findAllJoinCB = async () => {
  const con = await pool.getConnection(async (conn) => conn);
  const query = `
  SELECT 
    cb.car_no, 
    cb.car_nm, 
    cb.car_model_nm, 
    cb.car_color,
    cr.start_reserve,
    cr.end_reserve
  FROM car_bas cb 
    left join car_reserve cr on cb.car_id = cr.car_id
  `;
  const [reserve_info] = await con.query(query);
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

// reserve단독 정보 하나
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


// create reserve
const crateReserve = async (car_id, body) => {
  const con = await pool.getConnection(async (conn) => conn);
  const value = {};
  value.car_id = car_id;
  value.start_reserve = body.start_reserve;
  value.end_reserve = body.end_reserve;
  const query = `
  INSERT INTO car_reserve SET ?
  `
  await con.query(query, [value]);
  await con.release();

  return await findOne();
}

module.exports = {
  findAllJoinCB,
  findAll,
  crateReserve,
};
