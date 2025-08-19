const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthUser = require('../modals/Signup');

exports.register = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  try {
    const existingUser = await AuthUser.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    console.log("Registering Now")
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new AuthUser({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await AuthUser.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};