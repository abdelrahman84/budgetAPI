import mongoose from 'mongoose';

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: [true, 'First name required!'] },
    last_name: { type: String, required: [true, 'Last name required!'] },
    email: {
        type: String, required: 'Email address required',
        validate: [validateEmail, 'Please enter a valid email address'], match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
        index: { unique: true }
    },
    username: {
        type: String, required: 'username required',
        index: { unique: true }
    },
    password: { type: String, required: [true, 'Password cannot be left blank'] },
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
