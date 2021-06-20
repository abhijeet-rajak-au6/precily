const { Schema, model } = require("mongoose");

const dataSchema = Schema({
    name:{
        type:String,
        required:[true, "please provide name"]
    },
});


const DataModel = model("data",dataSchema);

module.exports = DataModel;