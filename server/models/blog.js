const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numberViews:{
        type:Number,
        default:0,
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisliked: {
        type: Boolean,
        default: false
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    images: {
        type: String,
        default: 'https://www.shutterstock.com/shutterstock/photos/1189626925/display_1500/stock-photo-blog-and-information-website-concept-workplace-background-with-text-view-from-above-1189626925.jpg'
    },
    author: {
        type: String,
        default: 'Admin'
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true},   
    toObject: {virtuals: true}
}
);
//Cho phép Mongoose trả về các field virtual khi, tính toán động(co thi hien, k co thi k hien)
// gửi JSON ra API (res.json())
// hoặc convert document sang object (doc.toObject())

//Export the model
module.exports = mongoose.model('Blog', blogSchema);