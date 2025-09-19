const validator = require("validator")

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter the strong Password");
    }
    //eithger give validation here or in schema
}

const validateProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "age", "gender"];

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    return isEditAllowed;
}

module.exports = {validateSignupData, validateProfileData};