import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'title required!'] },
    cycle: { type: Number, required: [true, 'budget cycle date is required!'] },
    balance: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
}
);

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
