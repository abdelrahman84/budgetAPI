import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    title: { type: String, required: [true, 'title required!'],  index: { unique: true } },
}, {
    timestamps: true
}
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
