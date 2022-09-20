import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const UserSchema = new mongoose.Schema
(
    {
        email: {
            type: String,
            required: 'Email required'
        },
        password: {
            type: String,
            required: 'Password required'
        },
        otp: {
            type: String
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

UserSchema.plugin(mongoosePaginate);

module.exports = {
    User: mongoose.model('User', UserSchema),
}
