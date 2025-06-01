const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Token = require('../models/Token');
const sendEmail = require('../utils/sendEmail');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

const generateRefreshToken = () => crypto.randomBytes(40).toString('hex');

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = new User({ username, email, password, role, verificationToken });
  await user.save();

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
  await sendEmail(email, 'Verify Your Email', `Click here to verify: ${verifyUrl}`);

  res.status(201).json({ message: 'User registered. Verify your email.' });
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({ verificationToken: token });
  if (!user) return res.status(400).json({ message: 'Invalid token' });

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();
  res.status(200).json({ message: 'Email verified successfully' });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  if (!user.isVerified) return res.status(401).json({ message: 'Email not verified' });

  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken();
  await new Token({ userId: user._id, token: refreshToken }).save();

  res.json({ accessToken, refreshToken });
};

exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  const storedToken = await Token.findOne({ token });
  if (!storedToken) return res.status(403).json({ message: 'Refresh token not found' });

  const user = await User.findById(storedToken.userId);
  const accessToken = generateToken(user);
  res.json({ accessToken });
};

exports.logout = async (req, res) => {
  const { token } = req.body;
  await Token.findOneAndDelete({ token });
  res.status(200).json({ message: 'Logged out successfully' });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'Password reset email sent' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await sendEmail(email, 'Reset Password', `Reset here: ${resetUrl}`);
  res.status(200).json({ message: 'Password reset email sent' });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
};