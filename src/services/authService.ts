import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin, { IAdmin } from '../models/adminModel';
import dotenv from 'dotenv';

dotenv.config();

const registerAdmin = async (username: string, password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newAdmin = new Admin({ username, password: hashedPassword });
  await newAdmin.save();
  return newAdmin;
};

const authenticateAdmin = async (username: string, password: string) => {
  const admin = await Admin.findOne({ username });
  if (!admin) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });

  return token;
};

export default {
  registerAdmin,
  authenticateAdmin,
};
