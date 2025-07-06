#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Employee Management GraphQL API...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 14) {
    console.error('❌ Node.js version 14 or higher is required');
    console.error(`Current version: ${nodeVersion}`);
    process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Check if package.json exists
const packageJsonPath = path.join(__dirname, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found. Please run this script from the backend directory.');
    process.exit(1);
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
    execSync('npm install', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Dependencies installed successfully');
} catch (error) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
}

// Check if config.env exists, create if not
const configPath = path.join(__dirname, 'config.env');
if (!fs.existsSync(configPath)) {
    console.log('\n⚙️  Creating config.env file...');
    const configContent = `PORT=4000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
DB_PATH=./database.sqlite`;

    fs.writeFileSync(configPath, configContent);
    console.log('✅ config.env created successfully');
} else {
    console.log('✅ config.env already exists');
}

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, 'src', 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Create other directories
const dirs = [
    'src/middleware',
    'src/graphql',
    'test'
];

dirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Start the server: npm run dev');
console.log('2. Open GraphQL Playground: http://localhost:4000/graphql');
console.log('3. Login with admin credentials:');
console.log('   Username: admin');
console.log('   Password: admin123');
console.log('\n📚 Check README.md for detailed documentation');
console.log('🧪 Use test/queries.graphql for testing examples'); 