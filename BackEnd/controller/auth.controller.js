import { User } from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { generateTokenandSetCookie } from "../utils/generateToken.js";

export async function signup(req, res) {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ sucess:false, message: 'Please fill in all fields' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ sucess:false, message: 'Invalid email' });
        }

        if (password.length < 6) {
            return res.status(400).json({ sucess:false, message: 'Password must be at least 6 characters' });
        }

        const existinguserbyemail = await User.findOne({email:email});

        if (existinguserbyemail) {
            return res.status(400).json({ sucess:false, message: 'User already exists with this email' });
        }

        const existingusernam = await User.findOne({username:username});

        if (existingusernam) {
            return res.status(400).json({ sucess:false, message: 'Username already taken' });
        }

        const salt = await bcryptjs.genSalt(10);
        const passwordHash = await bcryptjs.hash(password, salt);

        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const newUser = new User({
            email,
            password:passwordHash,
            username,
            image,
        });

        generateTokenandSetCookie(newUser._id, res);
        await newUser.save();

        res.status(201).json({ sucess:true, user: {
            ...newUser._doc,
            password: ""
            }
        });
        
    } catch (error) {
        console.log("Error in signup", error.message);
        res.status(500).json({ sucess:false, message: 'Internal server error' });
    }
}

export async function login(req, res) {
    res.send('Login route');
}

export async function logout(req, res) {
    res.send('Logout route');
}

//5.58.36