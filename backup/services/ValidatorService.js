const validator = require('validator');

const isValidEmail = (email) => {
    if(!email) return false;
    return validator.isEmail(email);
}

const isValidPassword = (password) => {
    if(!password) return false;
    return validator.isStrongPassword(password, {
        minLength: 8,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1
    });
}

module.exports = { isValidEmail, isValidPassword };