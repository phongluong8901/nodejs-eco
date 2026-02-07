// !mdbgum

const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true  //bo dau cach 2 dau khi vao db
    },
    slug:{  //dang gach noi link dan: dong-ho-apple
        type:String,
        required:true,
        // unique:true,
        lowercase: true     //viet thuong
    },
    description:{
        type:Array,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
    thumb: {
        type: String,
        required: true
    },
    price:{
        type:Number,
        required:true,
    },
    category: {
        type: String, // ĐỔI TỪ mongoose.Types.ObjectId THÀNH String
        required: true
    },
    quantity:{
        type:Number,
        default:0,      //k truyen thi mac dinh la 0
    },
    sold:{
        type:Number,
        default:0,
    },
    images:{
        type:Array,     // 1 mang cac anh
    },
    color:{
        type:String,
        ebum: ['Black', 'Grown', 'Red']     // cac mau cho truoc, chi trong day
    },
    ratings:[
        {
            star: {type: Number},
            postedBy: {type: mongoose.Types.ObjectId, ref: 'User'},
            comment: {type: String}
        }
    ],
    totalRatings: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
}
);

//Export the model
module.exports = mongoose.model('Product', productSchema);