const mongooose = require('mongoose');
const bcrypt = require('bcrypt');

const documentsSchema = new mongooose.Schema({
    documentName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    activeStatus: {
        type: Boolean,
        default:true
    }
},
{
    timestamps: true
})

const RequiredDocument = mongooose.model('RequiredDocument',documentsSchema);