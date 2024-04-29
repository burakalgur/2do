// authController.ts

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Wrong username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Wrong username or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const signUp = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); 
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'User created' });
  } catch (error) {
    console.error('User creation error', error);
    res.status(500).json({ message: 'Server error' });
  }
};
