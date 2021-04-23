const mongooose = require('mongoose');

const cptcodeSchema = new mongooose.Schema({
    cptCode: {
        type: String,
    },
    points: {
        type: Number,
    }
},
{
    timestamps: true
})

const CptCode = mongooose.model('CptCode',cptcodeSchema);