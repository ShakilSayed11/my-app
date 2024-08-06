// hashPassword.js

const bcrypt = require('bcryptjs');

// Replace 'password123' with the password you want to hash
const password = 'password123';

// Generate a salt
const salt = bcrypt.genSaltSync(10);

// Hash the password
const hash = bcrypt.hashSync(password, salt);

console.log('Hashed password:', hash);
