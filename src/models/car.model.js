const validator = require('validator');
const { v4: uuid } = require('uuid');
const { pool, transaction } = require('../middlewares/db');
const pick = require('../utils/pick');


class Car {
  constructor(car) {
    this.car_id = car.car_id;
    this.car_no = car.car_no;
    this.car_nm = car.car_nm;
    this.created_at = car.created_at;
    this.updated_at = car.updated_at;
  }

  static from(json) {
    return Object.assign(new Car(), json);
  }
}

const car_col = [
  'car_id',
  'car_no',
  'car_nm',
  'car_model_nm',
  'lat',
  'lng',
  'onoff',
  'created_at',
  'updated_at'
];

const condition = async (filter) => {
  let where_stmt = '';
  car_col.forEach((col) => {
    if (filter[col]) where_stmt += (where_stmt !== '' ? ' AND ' : '') + `${col}='${filter[col]}'`;
  });
  return where_stmt;
};

const isCarIdTaken = async (car_id) => {
  const conn = await pool.getConnection(async conn => conn);
  const query = `
    SELECT car_id
    FROM car_bas
    WHERE car_id = ?
  `;
  const [car] = await conn.query(query, [car_id]);
  await conn.release();
  if (!car || car.length === 0) {
    return false;
  }
  if (car.length === 1) {
    return true;
  }
  return true;
};

const isCarNoTaken = async (car_no) => {
  const conn = await pool.getConnection(async conn => conn);
  const query = `
    SELECT car_no 
    FROM car_bas 
    WHERE car_no = ?
  `;
  const [car] = await conn.query(query, [car_no]);
  await conn.release();
  if (!car || car.length === 0) {
    return false;
  }
  if (car.length === 1) {
    return true;
  }
  return true;
};

const isCarColorTaken = async (car_color) => {
  const conn = await pool.getConnection(async conn => conn);
  const query = `
    SELECT car_color 
    FROM car_bas 
    WHERE car_color = ?
  `;
  const [car] = await conn.query(query, [car_color]);
  await conn.release();
  if (!car || car.length === 0) {
    return false;
  }
  if (car.length === 1) {
    return true;
  }
  return true;
};

const getIdByNo = async (car_no) => {
  const conn = await pool.getConnection(async conn => conn);
  const query = `
    SELECT car_id
    FROM car_bas
    WHERE car_no = ?
  `;
  const [[car]] = await conn.query(query, [car_no]);
  await conn.release();
  
  return car.car_id;
}

const create = async (carBody) => {
  const { car_id, car_nm, car_no, car_model_nm, car_color } = carBody;

  const car = {
    car_id,
    car_nm,
    car_no,
    car_model_nm,
    car_color,
  };

  let newCar;
  const insert_bas_query = `
    INSERT INTO car_bas
    SET ?`;
  const insert_stat_query = `
    INSERT INTO car_stat (car_id)
    VALUES (?)`;
  const select_query = `
    SELECT *
    FROM car_bas
    WHERE car_id = ?`;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(insert_bas_query, [car]);
    await conn.query(insert_stat_query, [car_id]);
    [[newCar]] = await conn.query(select_query, [car_id]);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.release();
  }
  Object.assign(car, newCar);

  return car;
};

const findById = async (id) => {
  const con = await pool.getConnection(async conn => conn);
  const query = `
    SELECT C.car_id     AS car_id,
           C.car_no     AS car_no,
           C.car_nm     AS car_nm,
           C.car_model_nm     AS car_model_nm,
           C.car_color        AS car_color,
           CS.lat       AS lat,
           CS.lng       AS lng,
           CS.onoff     AS onoff,
           C.created_at AS created_at,
           C.updated_at AS updated_at
    FROM car_bas C
           LEFT JOIN car_stat CS ON C.car_id = CS.car_id
    WHERE C.car_id = ?
  `;
  const [[car]] = await con.query(query, [id]);
  await con.release();

  return car;
};

const findByIdBasic = async (id) => {
  const con = await pool.getConnection(async conn => conn);
  const query = `
    SELECT *
    FROM car_bas C
    WHERE C.car_id = ?
  `;
  const [[car]] = await con.query(query, [id]);
  await con.release();

  return car;
};

const findOne = async (filter) => {
  const { car_id } = filter;
  let where_stmt = await condition(filter);
  const con = await pool.getConnection(async conn => conn);
  const query = `
    SELECT C.car_id     AS car_id,
           C.car_no     AS car_no,
           C.car_nm     AS car_nm,
           C.car_model_nm     AS car_model_nm,
           C.car_color        AS car_color,
           CS.lat       AS lat,
           CS.lng       AS lng,
           CS.onoff     AS onoff,
           CS.onoff     AS onoff,
           C.created_at AS created_at,
           C.updated_at AS updated_at
    FROM car_bas C
           LEFT JOIN car_stat CS ON C.car_id = CS.car_id
    WHERE ${where_stmt}
  `;
  const [[car]] = await con.query(query);
  await con.release();

  return car;
};

const findAll = async () => {
  const con = await pool.getConnection(async conn => conn);
  const query = `
    SELECT C.car_no           AS car_no,
           C.car_nm           AS car_nm,
           C.car_model_nm     AS car_model_nm,
           C.car_color        AS car_color,
           CS.lat             AS lat,
           CS.lng             AS lng,
           CS.onoff           AS onoff,
           C.created_at       AS created_at,
           C.updated_at       AS updated_at
    FROM car_bas C
           LEFT JOIN car_stat CS ON C.car_id = CS.car_id
  `;
  const [cars] = await con.query(query);
  await con.release();

  return cars;
};

const queryCarsManage = async (filter, options) => {
  const { sortBy, sortOption, limit, page } = options;
  let where_stmt = await condition(filter);
  let option_stmt = '';

  if (sortBy) option_stmt += `order by ${sortBy} ${sortOption || ''} `;
  if (limit) option_stmt += 'limit ' + (page ? `${page}, ` : '') + limit;

  const con = await pool.getConnection(async conn => conn);
  const query = `
  SELECT * FROM car_bas ${where_stmt ? 'WHERE ' + where_stmt : ''} ${option_stmt || ''}
  `;
  const [cars] = await con.query(query);
  await con.release();

  return cars;
};

const save = async (prev, car) => {
  if (car) {
    const con = await pool.getConnection(async conn => conn);
    const query = `
      UPDATE car_bas
      SET ?,
          updated_at = now()
      WHERE car_id = ?
    `;
    await con.query(query, [car, prev.car_id]);
    await con.release();
  }

  return findByIdBasic(prev.car_id);
};

const saveState = async (car_id, car) => {

  if (car) {
    const con = await pool.getConnection(async conn => conn);
    const query = `
      UPDATE car_stat
      SET ?,
          updated_at = now()
      WHERE car_id = ?`;
    await con.query(query, [car, car_id]);
    await con.release();
  }

  return findById(car_id);
};


const remove = async (car_id) => {
  const car = await findById(car_id);


  const delete_bas_query = `
    DELETE
    FROM car_bas
    WHERE car_id = ?`;
  const delete_stat_query = `
    DELETE
    FROM car_stat
    WHERE car_id = ?`;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(delete_bas_query, [car_id]);
    await conn.query(delete_stat_query, [car_id]);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.release();
  }

  return car;
};

const user_privates = ['password', 'password_reset', 'is_email_verified', 'is_mobile_verified', 'verified'];
const user_details_privates = ['id', 'receive_mail', 'receive_sms'];
const toJSON = (user) => {
  user_privates.forEach(item => delete user[item]);
  if (user.details) {
    user_details_privates.forEach(item => delete user['details'][item]);
  }

  return user;
};

module.exports = {
  isCarIdTaken,
  create,
  findById,
  findOne,
  findAll,
  save,
  saveState,
  remove,
  toJSON,
  queryCarsManage,
  isCarNoTaken,
  getIdByNo,
  isCarColorTaken,
};
