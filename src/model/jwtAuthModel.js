import mongoose from "mongoose"

const JwtAuthSchema = new mongoose.Schema
(
    {
        userId: {
            type: String
        },
        token: {
            type: String
        },
        loginTime: {
            type: Date
        },
        expireTime: {
            type: Date
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = {
    JwtAuth: mongoose.model('JwtAuth', JwtAuthSchema),
}
