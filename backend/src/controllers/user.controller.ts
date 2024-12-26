import { Request, Response } from "express";
import User from "../model/user.model";
import jwt from "jsonwebtoken";

//register
const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ email, password, username });
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

// login
const login = async (req: Request, res: Response) => {
        try {
          const { email, password } = req.body;
          const user = await User.findOne({ email });
          if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
          }
      
          const isMatch = await user.matchPassword(password);
          if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
          }
      
          const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
          );
      
          res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
          });
      
          res.status(200).json({ message: "Login successful" });
        } catch (error) {
          res.status(500).json({ message: "Error logging in" });
        }
      };


// user profile
const userProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.user!;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error getting user", error });
  }
};

// logout
const logout = async (req: Request, res: Response) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 0, 
  });
  res.status(200).json({ message: "Logout successful" });
};

// check login
// const checkLogin = (req: Request, res: Response): void => {
//   if (req.user) {
//     res.status(200).json({ isLoggedIn: true });
//   } else {
//     res.status(401).json({ isLoggedIn: false });
//   }
// };
const checkLogin = (req: Request, res: Response): void => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(200).json({ isLoggedIn: false });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: Error | null, decoded: any) => {
    if (err) {
      console.error("Invalid token:", err.message);
      res.status(200).json({ isLoggedIn: false });
      return;
    }

    res.status(200).json({ isLoggedIn: true });
  });
};

export default {
  register,
  login,
  userProfile,
  logout,
  checkLogin,
};
