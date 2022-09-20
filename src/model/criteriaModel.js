import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const CriteriaSchema = new mongoose.Schema
(
    {
        start_date: {
            type: Date
        },
        end_date: {
            type: Date
        },
        type: {
            type: String
        },
        created_by: {
            type: String
        },
        updated_by: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

CriteriaSchema.plugin(mongoosePaginate);

module.exports = {
    Criteria: mongoose.model('Criteria', CriteriaSchema),
}
