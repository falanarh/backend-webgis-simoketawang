import { Request, Response } from 'express';
import authService from '../services/authService';

const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const newAdmin = await authService.registerAdmin(username, password);
    res.status(201).json({
      statusCode: 201,
      message: 'Admin registered successfully',
      data: newAdmin,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const token = await authService.authenticateAdmin(username, password);
    res.status(200).json({
      statusCode: 200,
      message: 'Login successful',
      token,
    });
  } catch (error: any) {
    res.status(400).json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export default {
  register,
  login,
};
