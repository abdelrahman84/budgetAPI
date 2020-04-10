var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/budget', {useNewUrlParser: true, useUnifiedTopology: true });