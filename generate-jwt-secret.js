#!/usr/bin/env node
/**
 * Generate JWT Secret for Hotel + HR Management System
 * 
 * Usage:
 *   node generate-jwt-secret.js
 * 
 * This will output a secure random JWT secret that you can use in your .env file
 */

const crypto = require('crypto');

// Generate a secure random secret (32 bytes = 256 bits)
const secret = crypto.randomBytes(32).toString('base64');

console.log('\n========================================');
console.log('JWT Secret Generated');
console.log('========================================\n');
console.log('Add this to your backend/.env file:');
console.log('\nJWT_SECRET=' + secret);
console.log('\n========================================\n');
console.log('⚠️  IMPORTANT: Keep this secret secure!');
console.log('   Never commit it to version control.\n');

