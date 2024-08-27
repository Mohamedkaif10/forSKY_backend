const pool = require("../Config/dbConnection");
const express = require("express");
const router = express.Router();

router.post("/newusers-register", async (req, res) => {
  const { firstname, lastname, password, email, phone_no } = req.body;

  try {
    const query = `
        INSERT INTO new_users (firstname, lastname, password, email, phone_no, role)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
    const values = [firstname, lastname, password, email, phone_no, "user"];

    const result = await pool.query(query, values);

    res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        data: result.rows[0],
      });
  } catch (error) {
    console.error("Error registering new user:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to register user" });
  }
});

router.post("/newmentors-register", async (req, res) => {
  const { firstname, lastname, password, email, phone_no } = req.body;

  try {
    const query = `
        INSERT INTO new_users (firstname, lastname, password, email, phone_no, role)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
    const values = [firstname, lastname, password, email, phone_no, "mentor"];

    const result = await pool.query(query, values);

    res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        data: result.rows[0],
      });
  } catch (error) {
    console.error("Error registering new user:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to register user" });
  }
});

router.get("/get-mentors", async (req, res) => {
  try {
    const query = `
        SELECT * FROM new_users WHERE role = $1;
      `;
    const values = ["mentor"];

    const result = await pool.query(query, values);

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch mentors" });
  }
});

router.get("/mentors/:id", async (req, res) => {
  const mentorId = req.params.id;

  try {
    const query = `
      SELECT * FROM new_users WHERE role = $1 AND id = $2;
    `;
    const values = ["mentor", mentorId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Mentor not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error fetching mentor:", error);
    res.status(500).json({ success: false, message: "Failed to fetch mentor" });
  }
});
module.exports = router;
