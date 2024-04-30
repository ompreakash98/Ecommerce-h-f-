const mongoose = require('mongoose');

const username = 'omprakashblackbull';
const password = 'Om@BlackBull';  // Update with your actual password
const clusterName = 'cluster0';
const databaseName = 'mern-e-commerce';

// Encode the special characters in the password
const uri = `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${clusterName}.y7w6p9o.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

const connectionDb = async () => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connection successfully established");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(0);
    }
};

module.exports = connectionDb;
