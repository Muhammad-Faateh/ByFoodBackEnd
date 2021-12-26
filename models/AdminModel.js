const mongoose = require("mongoose");
const bycrpt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    role: {
        type: String,
        default: "Admin",
    },
});

AdminSchema.methods.encryptPassword = async function(password) {
    let hashPassword = await bycrpt.hash(password, 10);
    return hashPassword;
};
AdminSchema.methods.decryptPassword = async function(password, hashPassword) {
    let validPassword = bycrpt.compare(password, hashPassword);
    return validPassword;
};

const Admin = mongoose.model("Admin", AdminSchema);

module.exports.Admin = Admin;