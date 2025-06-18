import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    role: {
      type: String,
      enum: ['Guest', 'VIP Guest', 'Administrator', 'Manager', 'Front Desk'],
      default: 'Guest',
    },
    department: {
      type: String,
      default: '',
    },
    registeredDate: {
      type: Date,
      default: Date.now,
    },
    lastVisit: {
      type: Date,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    isStaff: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.signup = async function (
  fullName,
  userName,
  email,
  password,
  role = 'Guest',
  phone = '',
  isStaff = false
) {
  const exist = await this.findOne({ email });
  const existU = await this.findOne({ userName });

  if (exist) {
    throw Error('Email already exists.!.');
  }
  if (existU) {
    throw Error('Username already taken.!.');
  }

  if (!email || !password || !userName || !fullName) {
    throw Error('All fields must be filled...');
  }

  if (!validator.isEmail(email)) {
    throw Error('Not a valid email.!.');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    fullName,
    userName,
    email,
    password: hash,
    role,
    phone,
    isStaff,
    department: isStaff ? 'Management' : '',
    status: 'Active',
  });

  return user;
};

userSchema.statics.login = async function (userName, password) {
  if (!password || !userName) {
    throw Error('All fields must be filled...');
  }

  const user = await this.findOne({ userName });

  if (!user) {
    throw Error('Incorrect userName.!.');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error('Incorrect password.!.');
  }

  // Update last login time
  user.lastLogin = new Date();
  await user.save();

  return user;
};

const user = mongoose.model('UserCollection', userSchema);

export default user;
