const { generateOTP, sendEmail } = require("./mail");
const db = require("../Config/dbConnection");

const crypto = require("crypto");
const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await db.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "Email not found in the user table" });
    }

    const otp = generateOTP();

    const otpQuery = "INSERT INTO otps (email, otp) VALUES ($1, $2)";
    await db.query(otpQuery, [email, otp]);

    await sendEmail(
      email,
      "Your OTP for Password Reset",
      `Your OTP is: ${otp}`
    );

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const query = "SELECT * FROM otps WHERE email = $1 AND otp = $2";
    const result = await db.query(query, [email, otp]);

    if (result.rows.length > 0) {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const otpVerificationQuery = "SELECT * FROM otps WHERE email = $1";
    const otpVerificationResult = await db.query(otpVerificationQuery, [email]);

    if (otpVerificationResult.rows.length > 0) {
      const hashedPassword = crypto
        .createHmac("sha256", process.env.secretKey)
        .update(newPassword)
        .digest("hex");

      const updatePasswordQuery =
        "UPDATE users SET password = $1 WHERE email = $2";
      await db.query(updatePasswordQuery, [hashedPassword, email]);

      const deleteOtpQuery = "DELETE FROM otps WHERE email = $1";
      await db.query(deleteOtpQuery, [email]);

      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(400).json({ error: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { sendOTP, verifyOTP, updatePassword };
