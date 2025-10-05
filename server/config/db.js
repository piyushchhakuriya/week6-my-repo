const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

        mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
});

    console.log("MongoDB Connected");
    } catch (error) {
        console.log("Error in connecting to the databases", error);
    }
}

module.exports = connectDb;