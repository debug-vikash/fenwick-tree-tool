const User = require('../models/User');

async function registerUser(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Please fill all fields" });
    }

    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const newUser = new User({
            name: name,
            email: email,
            password: password
        });
        
        await newUser.save();

        res.json({ message: "Registration successful!" });
    } catch (error) {
        res.status(500).json({ error: "Server error occurred" });
    }
}

async function loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: email });

        if (user && user.password === password) {
            res.json({ 
                message: "Login successful!",
                email: user.email
            });
        } else {
            res.status(400).json({ error: "Wrong email or password" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error occurred" });
    }
}

module.exports = {
    registerUser: registerUser,
    loginUser: loginUser
};
