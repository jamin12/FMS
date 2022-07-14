const mysql = require('mysql2/promise');
const config = require('../config/config');
const logger = require('../config/logger');

const pool = mysql.createPool(config.mysql.options);

const transaction = (conn, body, done) => {
  conn.getConnection((err, conn) => {

    conn.beginTransaction(err => {
      if (err) return done(err);

      body(err => {
        if (err) return conn.rollback(() => {
          done(err);
        });

        conn.commit(err => {
          if (err) return conn.rollback(() => {
            done(err);
          });

          done();
        });
      });
    });
  });
};


const connect = (name = 'db') => {
  return async (req, res, next) => {
    if (req[name]) return next();

    const connection = await pool.getConnection();

    let isReleased = false;
    const { release } = connection;

    connection.release = () => {
      if (isReleased) return;

      isReleased = true;
      release.call(connection);
    };

    res.on('close', () => {
      connection.release();
    });

    res.on('finish', () => {
      connection.release();
    });

    req[name] = connection;

    next();
  };
};

module.exports = {
  pool,
  transaction,
  connect
};
