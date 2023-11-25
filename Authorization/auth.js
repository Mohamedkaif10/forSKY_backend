const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../Config/dbConnection');

const secretKey = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwMDkwOTI1OSwiaWF0IjoxNzAwOTA5MjU4fQ.HVwsICuRlRh0DV9PK8IRVeqXFTA2IxKbkOzQBP_4-J4';

const registerUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
    [username, hashedPassword]
  );
  const user = result.rows[0];
  return { id: user.id, username: user.username };
};

const loginUser = async (username, password) => {
  const result = await db.query('SELECT * FROM users WHERE username = $1', [
    username,
  ]);

  const user = result.rows[0];
  if (!user) throw new Error('Invalid username or password.');

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new Error('Invalid username or password.');

  const token = jwt.sign({ id: user.id, username: user.username }, secretKey);
  return { token };
};

module.exports = { registerUser, loginUser };
