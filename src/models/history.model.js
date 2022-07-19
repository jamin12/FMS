const validator = require('validator');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const { pool, transaction } = require('../middlewares/db');
const pick = require('../utils/pick');
const logger = require('../config/logger');


class History {
  constructor(history) {
    this.car_id = history.car_id;
    this.car_no = history.car_no;
    this.car_nm = history.car_nm;
    this.created_at = history.created_at;
    this.updated_at = history.updated_at;
  }

  static from(json) {
    return Object.assign(new History(), json);
  }
}

const history_col = [
  'car_id',
  'colec_dt',
  'trip_seq',
  'lat',
  'lng',
  'created_at',
  'updated_at'
];

const condition = async (filter) => {
  let where_stmt = '';
  history_col.forEach((col) => {
    if (filter[col]) where_stmt += (where_stmt !== '' ? ' AND ' : '') + `${col}='${filter[col]}'`;
  });
  return where_stmt;
};

const createHistory = async (historyBody) => {
  const { car_id, trip_seq, data } = historyBody;

  let result;
  const insert_query = `
      INSERT INTO drive_hst (car_id, colec_dt, trip_seq, lat, lng)
      VALUES (?,?,?,?,?)`;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    [result] = await conn.query(insert_query, [car_id, data.colec_dt, trip_seq,  data.lat, data.lng]);
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

const createPointHistory = async (historyBody) => {
  const { car_id, colec_dt, trip_seq, lat, lng, fid } = historyBody;

  let result;
  const insert_query = `
      INSERT INTO drive_point_hst (car_id, colec_dt, trip_seq, lat, lng, fid)
      VALUES (?, ?, ?, ?, ?, ?)`;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    [result] = await conn.query(insert_query, [car_id, colec_dt, trip_seq, lat, lng, fid]);
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

const createTrip = async (car_id, trip_seq, colec_dt, lat, lng) => {
  let result;
  const insert_query = `
      INSERT INTO trip_hst (car_id, trip_seq, st_lat, st_lng, start_dt, created_at)
      VALUES (?, ?, ?, ?, ?, now())`;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    [result] = await conn.query(insert_query, [car_id, trip_seq, lat, lng, colec_dt]);
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

const updateTrip = async (car_id, trip_seq, colec_dt, lat, lng) => {
  let result;
  const update_query = `
      UPDATE trip_hst
      SET fin_lat    = ?,
          fin_lng    = ?,
          end_dt     = ?,
          updated_at = NOW()
      WHERE car_id = ?
        AND trip_seq = ?`;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    [result] = await conn.query(update_query, [lat, lng, colec_dt, car_id, trip_seq]);
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

const findTripHistory = async (car_id, start_dt, end_dt) => {
  let result;
  const select_query = `
      SELECT C.car_id                                          AS car_id,
             C.car_no                                          AS car_no,
             C.car_nm                                          AS car_nm,
             DATE_FORMAT(TRIP.trip_seq, '%Y-%m-%d %H:%i:%S')   AS trip_seq,
             DATE_FORMAT(TRIP.start_dt, '%Y-%m-%d %H:%i:%S')   AS start_dt,
             DATE_FORMAT(TRIP.end_dt, '%Y-%m-%d %H:%i:%S')     AS end_dt,
             TRIP.st_lat                                       AS st_lat,
             TRIP.st_lng                                       AS st_lng,
             TRIP.fin_lat                                      AS fin_lat,
             TRIP.fin_lng                                      AS fin_lng,
             DATE_FORMAT(TRIP.created_at, '%Y-%m-%d %H:%i:%S') AS created_at,
             DATE_FORMAT(TRIP.updated_at, '%Y-%m-%d %H:%i:%S') AS updated_at
      FROM car_bas C
               LEFT JOIN car_stat CS ON C.car_id = CS.car_id
               LEFT JOIN trip_hst TRIP on C.car_id = TRIP.car_id
      WHERE C.car_id = ?
        AND TRIP.start_dt >= ?
        AND CASE
                WHEN TRIP.end_dt IS NOT NULL THEN TRIP.end_dt <= ?
                ELSE true END`;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    [result] = await conn.query(select_query, [car_id, start_dt, end_dt]);
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

const findHistory = async (car_id, trip_seq) => {
  let result;
  const select_query = `
      WITH TRIP AS (
          SELECT *
          FROM trip_hst
          WHERE car_id = ?
            AND trip_seq = ?
      )
      SELECT#            DH.car_id,            DH.trip_seq,
            DATE_FORMAT(DH.colec_dt, '%Y-%m-%d %H:%i:%S') AS colec_dt,
            DH.lat                                        AS lat,
            DH.lng                                        AS lng
      FROM (
               SELECT D.car_id, D.colec_dt, D.lat, D.lng, D.trip_seq
               FROM drive_hst D,
                    TRIP
               WHERE D.car_id = TRIP.car_id
                 AND colec_dt >= TRIP.start_dt
                 AND IF(TRIP.end_dt IS NOT NULL, colec_dt <= TRIP.end_dt, true)
           ) DH`;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    [result] = await conn.query(select_query, [car_id, trip_seq]);
    logger.debug(result);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.release();
  }

  return {
    car_id,
    trip_seq,
    data: result
  };
};

const findPointHistory = async (car_id, trip_seq) => {
  let result;
  const select_query = `
      WITH TRIP AS (
          SELECT *
          FROM trip_hst
          WHERE car_id = ?
            AND trip_seq = ?
      )
      SELECT DH.car_id,
             DATE_FORMAT(DH.colec_dt, '%Y-%m-%d %H:%i:%S') AS colec_dt,
             DH.lat,
             DH.lng,
             DH.fid
      FROM (
               SELECT D.car_id, D.colec_dt, D.lat, D.lng, D.fid
               FROM drive_point_hst D,
                    TRIP
               WHERE D.car_id = TRIP.car_id
                 AND colec_dt >= TRIP.start_dt
                 AND IF(TRIP.end_dt IS NOT NULL, colec_dt <= TRIP.end_dt, true)
           ) DH`;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    [result] = await conn.query(select_query, [car_id, trip_seq]);
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

// trip_seq 리스트 가져오기
const getTripSeqList = async (car_id) => {
  const conn = await pool.getConnection();
  const select_query = `
      SELECT distinct th.trip_seq, car_id 
      FROM trip_hst th 
      WHERE car_id = ?
  `
  const [result] = await conn.query(select_query,[car_id]);

  return result;
};

module.exports = {
  findTripHistory,
  findHistory,
  findPointHistory,
  createHistory,
  createPointHistory,
  createTrip,
  updateTrip,
  getTripSeqList,
};
