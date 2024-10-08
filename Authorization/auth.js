const jwt = require("jsonwebtoken");
const db = require("../Config/dbConnection");
const crypto = require("crypto");
require("dotenv").config();
const secretKey = process.env.secretKey;
const hashPassword = (password) => {
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(password)
    .digest("hex");
  return hash;
};
const registerUser = async (firstname, lastname, password, email, phone_no) => {
  const hashedPassword = hashPassword(password);
  const result = await db.query(
    "INSERT INTO users (firstname, lastname, password, email, phone_no) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [firstname, lastname, hashedPassword, email, phone_no]
  );
  const user = result.rows[0];
  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone_no: user.phone_no,
  };
};
const loginUser = async (email, password) => {
  const result = await db.query(
    "SELECT id, email, password, firstname FROM users WHERE email = $1",
    [email]
  );

  const user = result.rows[0];
  if (!user) throw new Error("Invalid email or password.");

  const passwordMatch = user.password === hashPassword(password);
  if (!passwordMatch) throw new Error("Invalid email or password.");

  const token = jwt.sign(
    { id: user.id, email: user.email, firstname: user.firstname },
    secretKey
  );
  return { token };
};

module.exports = { registerUser, loginUser };
