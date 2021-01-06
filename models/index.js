import mongoose from 'mongoose';

import User from './user';
import Budget from './budget';
import Category from './category';

const connectDb = () => {
    return mongoose.connect('mongodb://localhost/budget', {useNewUrlParser: true, useUnifiedTopology: true });
};

const models = {User, Budget, Category};

export {connectDb};

export default models;
