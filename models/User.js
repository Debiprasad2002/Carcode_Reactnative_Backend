const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust path as needed

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    otpExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

module.exports = User;
