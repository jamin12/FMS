const validator = require('validator');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const { pool, transaction } = require('../middlewares/db');
const pick = require('../utils/pick');
const { roles } = require('../config/roles');
const UserDetail = require('./user.detail.model');


class User {
  constructor(user) {
    this.id = user.id;
    this.email = user.email;
    this.mobile = user.mobile;
    this.password = user.password;
    this.username = user.username;
    this.name = user.name;
    this.birth = user.birth;
    this.sex = user.sex;
    this.use_dm = user.use_dm;
    this.receive_mail = user.receive_mail;
    this.accept_terms = user.accept_terms;
    this.email_verified = user.email_verified;
    this.mobile_verified = user.mobile_verified;
  }

  static from(json) {
    return Object.assign(new User(), json);
  }
}

const user_col = [
  'id',
  'username',
  'password',
  'role',
  'mobile',
  'name',
  'accept_terms',
  'email',
  'mobile_verified'
];


const joinUserDetail = async (user, details) => {
  if (!user) return user;
  if (details) {
    user.details = details;
  } else {
    const details = await UserDetail.findById(user.id);
    user.details = details;
  }

  return user;
};

const splitUserDetails = async (user) => {
  const userDetails = JSON.parse(JSON.stringify(user.details));
  user = pick(user, user_col);
  return { user, userDetail: userDetails };
};

const isEmailTaken = async (email) => {
  const conn = await pool.getConnection(async conn => conn);
  const query = `
    SELECT email FROM users WHERE email = ?
  `;
  const [user] = await conn.query(query, [email]);
  await conn.release();

  if (!user || user.length === 0) {
    return false;
  }
  if (user.length === 1) {
    return true;
  }
  return true;
};

const isMobileTaken = async (mobile) => {
  const con = await pool.getConnection(async conn => conn);
  const query = `
    SELECT mobile FROM user_details WHERE mobile = ?
  `;
  const [user] = await con.query(query, [mobile]);
  await con.release();

  if (!user || user.length === 0) {
    return false;
  }
  if (user.length === 1) {
    return true;
  }
  return true;
};

const isUsernameTaken = async (username) => {
  const con = await pool.getConnection(async conn => conn);
  const query = `
    SELECT username FROM users WHERE username = ?
  `;
  const [user] = await con.query(query, [username]);
  await con.release();

  if (!user || user.length === 0) {
    return false;
  }
  if (user.length === 1) {
    return true;
  }
  return true;
};

const isPasswordMatch = async (id, password) => {
  const con = await pool.getConnection(async conn => conn);
  const query = `
    SELECT password FROM users WHERE id=?
  `;
  const [[user]] = await con.query(query, [id]);
  await con.release();
  if (!user) {
    return false;
  }
  return bcrypt.compare(password, user.password);
};

const create = async (userBody) => {
  const { email, username, password, details, role } = userBody;

  if (!validator.isEmail(email)) {
    throw new Error('Invalid email');
  }
  if (!password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
    throw new Error('Password must contain at least one letter and one number');
  }

  const user = {
    id: uuid(),
    email: email,
    username: username,
    password: await bcrypt.hash(password, 8)
  };

  const userDtails = {
    id: user.id,
    name: details.name,
    mobile: details.mobile,
    gender: details.gender,
    memo: details.memo
  };

  if (role) user.role = role;

  let newUser;
  const insert_query = `
  INSERT INTO users SET ?`;
  const select_query = `
  SELECT * FROM users WHERE id = ?`;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(insert_query, [user]);
    [[newUser]] = await conn.query(select_query, [user.id]);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.release();
  }
  Object.assign(user, newUser);
  user.details = await UserDetail.create(userDtails);

  return user;
};

const findById = async (id) => {
  const con = await pool.getConnection(async conn => conn);
  const query = `
  SELECT * FROM users WHERE id = ?
  `;
  const [[user]] = await con.query(query, [id]);
  await con.release();

  return joinUserDetail(user);
};

const findOne = async (filter) => {
  const { id, email, mobile, username } = filter;
  let where_stmt = '';
  if (id) where_stmt += (where_stmt === '' ? '' : 'AND ') + `id='${id}'`;
  if (email) where_stmt += (where_stmt === '' ? '' : 'AND ') + `email='${email}'`;
  if (mobile) where_stmt += (where_stmt === '' ? '' : 'AND ') + `mobile='${mobile}'`;
  if (username) where_stmt += (where_stmt === '' ? '' : 'AND ') + `username='${username}'`;
  const con = await pool.getConnection(async conn => conn);
  const query = `
  SELECT * FROM users WHERE ${where_stmt}
  `;
  const [[user]] = await con.query(query);
  await con.release();

  return joinUserDetail(user);
};

const findAll = async (filter, options) => {
  const { name, role } = filter;
  const { sortBy, sortOption, limit, page } = options;
  let where_stmt = '';

  if (name) where_stmt += (where_stmt === '' ? '' : 'AND ') + `username='${name}' `;
  if (role) where_stmt += (where_stmt === '' ? '' : 'AND ') + `role='${role}' `;
  if (sortBy) where_stmt += 'order by ' +  sortBy + ' ' + sortOption + ' ';
  if (limit) where_stmt += 'limit ' + (page ? `${page}, ` : '') + limit;

  const con = await pool.getConnection(async conn => conn);
  const query = `
  SELECT * FROM users WHERE ${where_stmt}
  `;
  const [user] = await con.query(query);
  await con.release();

  return joinUserDetail(user);
};

const save = async (prev, user) => {
  const result = await splitUserDetails(user);
  const user_details = result.userDetail;
  user = result.user;

  if (user) {
    if (prev.password !== user.password) user.password = await bcrypt.hash(user.password, 8);

    const con = await pool.getConnection(async conn => conn);

    /* `update_at`	datetime	null default current_timestamp on update current_timestamp 
    database updated_at컬럼에 on update가 달려 있어야함 */
    const query = `
    UPDATE users SET ? WHERE id = ?`;
    await con.query(query, [user, user.id]);
    await con.release();
  }
  if (user_details) {
    await UserDetail.save(user_details, user.id);
  }
  return findById(user.id);
};

const remove = async (id) => {
  const con = await pool.getConnection(async conn => conn);
  const user = await findById(id);

  await UserDetail.remove(id);
  
  const query = `
  DELETE FROM users WHERE id = ?
  `;
  const result = await con.query(query, [id]);
  await con.release();

  return user;
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

// 페이징 처리
const pageResult = (limit, curpage) => {
    // 디폴트 페이지 가져올 사이즈
    const DEFAULT_START_PAGE = 1;
    const DEFAULT_PAGE_SIZE = limit ? limit : 5;
    
  // 페이지가 0보다 작으면 기본 페이지 적용
  if (curpage <= 0)  curpage = DEFAULT_START_PAGE
  return {
      offset: (curpage - 1) * DEFAULT_PAGE_SIZE,
      limit: DEFAULT_PAGE_SIZE
  };
}

module.exports = {
  isEmailTaken,
  isMobileTaken,
  isUsernameTaken,
  isPasswordMatch,
  create,
  findById,
  findOne,
  save,
  remove,
  toJSON,
  findAll,
};
