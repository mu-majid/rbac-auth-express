const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: String }]  // e.g., ['create:post', 'delete:post']
});

module.exports = mongoose.model('Role', roleSchema);
