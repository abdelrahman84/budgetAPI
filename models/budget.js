var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var budgetSchema = new Schema({
    title: { type: String, required: [true, 'title required!'] },
    cycle: { type: Number, required: [true, 'budget cycle date is required!'] },
    balance: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
}
);

module.exports = mongoose.model('Budget', budgetSchema);