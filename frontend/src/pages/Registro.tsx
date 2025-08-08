// // import mongoose from 'mongoose';
// // import bcrypt from '';
// import React from "react";

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 15);
//   }
//   next();
// });

// export const User = mongoose.model('', userSchema);

// import { Request, Response } from '';

// export const registerUser = async (req: Request, res: Response) => {
//   try {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ message: '' });
//     }

//     const newUser = new User({ username, email, password });
//     await newUser.save();

//     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, { expiresIn: '' });

//     res.status(201).json({ message: '', token });
//   } catch (error: any) {
//     if (error.code === 11000) { // Duplicate key error
//       return res.status(409).json({ message: '' });
//     }
//     res.status(500).json({ message: '' });
//   }
// };