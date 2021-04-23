const mongooose = require('mongoose');
const bcrypt = require('bcrypt');


const providerSchema = new mongooose.Schema({
    parentId: {
        type: String
    },
    firstName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 45
    },
    lastName: {
        type: String,
        minlength: 1,
        maxlength: 45
    },
    // fileName: {
    //     type: String,
    //     required: true,
    // },
    providerEmail:{
        type: String,
    },
    provideLoginId: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 40
    },
    providerLoginId:{
        type: String
    },
    providerTypes: {
        type: [],
        maxlength: 255,
    },
    activeStatus : {
        type : Boolean,
        default: true
    },
    userRole:{
        type: String
    }
},
{
    timestamps: true
})



const Provider = mongooose.model('Provider',providerSchema);