const LocalStrategy = require("passport-local").Strategy;

const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");
// const JWTStrategy = require("passport-jwt").Strategy;
// const { fromAuthHeaderAsBearerToken } = require("passport-jwt");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { JWT_SECRET } = require("../config/keys");

//local
exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found");
      return done(null, false);
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      console.log("Passwords do not match");
      return done(null, false);
    }

    console.log("Authentication successful for user:", user);
    return done(null, user);
  } catch (error) {
    console.error("Error in localStrategy:", error.message);
    return done(error);
  }
});

//jwt
exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (payload, done) => {
    if (Date.now() > payload.exp) return done(null, false);
    try {
      const user = await User.findById(payload.id);
      return user ? done(null, user) : done(null, false);
    } catch (error) {
      done(error);
    }
  }
);
