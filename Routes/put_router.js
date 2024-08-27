const express = require("express");
const router = express.Router();
const { updatePassword } = require("../functions/otp");
const dynamicJwtCheck = require("../Authorization/dynamicVerifyToken");
const pool = require("../Config/dbConnection");

router.put("/update-password", updatePassword);

router.put("/update-role-name", dynamicJwtCheck, async (req, res) => {
  try {
    console.log(req.user);
    const client = await pool.connect();
    const email = req.user.email;
    if (email !== req.body.email) {
      return res
        .status(400)
        .json({ message: "You are not the owner of this email" });
    }

    const checkExit = await client.query(
      "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)",
      [email]
    );
    if (!checkExit.rows[0].exists) {
      return res.status(400).json({ message: "User doesn't exit" });
    }

    const result = await client.query(
      `UPDATE users SET role = $1 WHERE email = $2`,
      [req.body.role, email]
    );
    await client.release();
    res.status(200).json({ message: "successful updated" });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
