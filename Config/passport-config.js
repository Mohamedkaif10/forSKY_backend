// passport-config.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./dbConnection')
require('dotenv').config();
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      const user = result.rows[0];
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

passport.use(
  new GoogleStrategy(
    {
      clientID:process.env.clientID,
    clientSecret:process.env.clientSecret,
      callbackURL: 'http://localhost:8002/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if the user with this Google ID exists in the database
          const result = await db.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
  
          if (result.rows.length === 0) {
            // User doesn't exist, create a new user
            const insertResult = await db.query(
              'INSERT INTO users (google_id, display_name) VALUES ($1, $2) RETURNING *',
              [profile.id, profile.displayName]
            );
            const user = insertResult.rows[0];
  
            return done(null, user);
          } else {
            // User already exists
            const user = result.rows[0];
            return done(null, user);
          }
        } catch (error) {
          console.error(error);
          return done(error, null);
        }
      }
    )
  );
  module.exports = passport;