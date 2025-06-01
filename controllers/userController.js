const User = require('../models/User');

exports.getUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json(users);
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.status(200).json(user);
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.status(200).json(user);
};

exports.updateUser = async (req, res) => {
  const { username, email, role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (username) user.username = username;
  if (email) user.email = email;
  if (role) user.role = role;

  await user.save();
  res.status(200).json({ message: 'User updated', user });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.remove();
  res.status(200).json({ message: 'User deleted' });
};
