// User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  uuid: [{ type: String }],
  email: { type: String, required: true, unique: true },
  mobileNo: { type: String, unique: true },
  passwordHash: { type: String },
  status: { type: String, default: 'OTP' },
  emailVerification: {
    otp: { type: String },
    created: { type: Date },
  },
  has_wallet: { type: Boolean },
  access_rules: { type: String, default: 'member' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  wallets: [
    {
      address: { type: String },
      type: { type: String },
      created: { type: Date },
    },
  ],
  invalidLogin: {
    count: { type: Number, default: 0 },
    blockedOn: { type: Date },
  },
  firstLogin: { type: Boolean, default: true },
});

UserSchema.index({ email: 1 }, { mobileNo: 1 }, { unique: true });
mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
