import mongoose from "mongoose"

async function mongoConfig() {
    console.log("connecting")
    try {
        await mongoose.connect('mongodb://localhost:27017/mystery-box',{ useNewUrlParser: true });
        console.log("connected")
    } catch (error) {
        console.log("db error", error);
    }
}

export default mongoConfig