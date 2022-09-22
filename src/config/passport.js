const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.AUTHORIZATION) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const localOptions = {
  usernameField: 'email',
  passwordField: 'password',
};

const loclaVerify = async (email, password, done) => {
  try {
    if (await User.isPasswordMatchByEmail(email, password)) {
      const user = await User.findByEmail(email);
      done(null, user.id);
    } else {
      done(error, false);
    }
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
const localStrategy = new LocalStrategy(localOptions, loclaVerify);

module.exports = {
  jwtStrategy,
  localStrategy,
};
