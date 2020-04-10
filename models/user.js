var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var userSchema = new Schema({
    first_name: { type: String, required: [true, 'First name required!'] },
    last_name: { type: String, required: [true, 'Last name required!'] },
    email: {
        type: String, required: 'Email address required',
        validate: [validateEmail, 'Please enter a valid email address'], match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
        index: { unique: true }
    },
    password: { type: String, required: [true, 'Password cannot be left blank'] },
});

module.exports = mongoose.model('Users', userSchema);
