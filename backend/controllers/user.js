import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { inngest } from "../ingest/client.js";

export const signup = async (req, res) => {
  const { email, password, skills = [] } = req.body;
  try {
    const hashedPassword = bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, skills });

    // ingest event
    await inngest.send({
      name: "user/signup",
      data: {
        email,
      },
    });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "error invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }
    });

    res.json({message:"Logout Successfully!"})
  } catch (error) {
    res.status(500).json({ error: "Logout failed", details: error.message });
  }
};

export const updateUser = async(req,res)=>{
    const {skills=[],email,role} = req.body
    try {
        if(req.user.role !== 'admin'){
            return res.status(403).json({error:"Forbidden"})
        }

        const user = await User.findOne({email})
        if(!user) return res.status(404).json({error:"User not found"})

            await User.updateOne({email},{skills: skills.length ? skills : user.skills,role})

            return res.status(200).json({message:"User updated successfully"})
    } catch (error) {
        res.status(500).json({ error: "User update failed", details: error.message });
    }
}

export const getUser = async(req,res)=>{
    try {
        if(req.user.role !== "admin"){
            return res.status(403).json({error:"Forbidden"})
        }

        const users = await User.find().select("-password")
        return res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: "Get Users failed", details: error.message });
    }
}
