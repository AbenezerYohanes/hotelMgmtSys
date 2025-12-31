const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { initDb } = require('../config/db');

let models;

const getModels = async () => {
  if (!models) {
    const sequelize = await initDb();
    models = require('../models')(sequelize);
  }
  return models;
};

/* ================= LOGIN ================= */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const models = await getModels();

    const user = await models.Employee.findOne({
      where: { email },
      include: [{ model: models.Role, as: 'role' }]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ✅ Correct bcrypt comparison
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not set');
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role?.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role?.name
      }
    });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ================= REGISTER ================= */
const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, roleId } = req.body;

    const models = await getModels();

    const exists = await models.Employee.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // ✅ Hash only once
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await models.Employee.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      roleId
    });

    res.status(201).json({
      message: 'User registered successfully',
      id: user.id,
      email: user.email
    });

  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { login, register };
