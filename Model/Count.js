const { Schema, model } = require("mongoose");

const countSchema = Schema({
    count:{
        type:Number
    },
    height:{
        type:Number
    }
});


const CountModel = model("count",countSchema);

module.exports = CountModel;