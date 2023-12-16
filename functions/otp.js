const {generateOTP, sendEmail}= require('./mail')
const db = require('../Config/dbConnection');
const bcrypt = require('bcrypt');
const sendOTP = async (req, res) => {
    const { email } = req.body;
  
    try {
      const userQuery = 'SELECT * FROM users WHERE email = $1';
      const userResult = await db.query(userQuery, [email]);
  
      if (userResult.rows.length === 0) {
        return res.status(400).json({ error: 'Email not found in the user table' });
      }
  
      // Continue with OTP generation and sending if the email exists
      const otp = generateOTP();
  
      // Save the OTP in the database with the user's email
      const otpQuery = 'INSERT INTO otps (email, otp) VALUES ($1, $2)';
      await db.query(otpQuery, [email, otp]);
  
      // Send the OTP to the user's email
      await sendEmail(email, 'Your OTP for Password Reset', `Your OTP is: ${otp}`);
  
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      // Check if the OTP is valid
      const query = 'SELECT * FROM otps WHERE email = $1 AND otp = $2';
      const result = await db.query(query, [email, otp]);
  
      if (result.rows.length > 0) {
        res.status(200).json({ message: 'OTP verified successfully' });
      } else {
        res.status(400).json({ error: 'Invalid OTP' });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  const updatePassword = async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
      // Hash the new password before updating it in the database
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update user password in the database
      const updatePasswordQuery = 'UPDATE users SET password = $1 WHERE email = $2';
      await db.query(updatePasswordQuery, [hashedPassword, email]);
  
      // Remove the used OTP from the database
      const deleteOtpQuery = 'DELETE FROM otps WHERE email = $1';
      await db.query(deleteOtpQuery, [email]);
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports={sendOTP, verifyOTP,updatePassword}