// !mdbgum
const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default: 'user',
    },
    cart: {
        type:Array,
        default: [],
    },
    address: [
        {type:mongoose.Types.ObjectId, ref: 'Address'}
    ],
    wishlist: [
        {type:mongoose.Types.ObjectId, ref: 'Product'}
    ],
    isBlocked: {
        type:Boolean,
        default: false
    },
    refreshToken: {
        type:String,
    },
    passwordChangeAt: {
        type:String
    },
    passwordResetToken: {
        type:String,
    },
    passwordResetExpires: {
        type:String,
    },
}, {timestamps: true}
);

// truoc khi luu se thuc hien cac ham
userSchema.pre('save', async function(next) {
    // neu thay doi -> true | khong thay doi -> next() tuong tu return
    if (!this.isModified('password')) {
        next()
    }

    // so luong phuc tap cho vao bam password 10
    const salt = bcrypt.genSaltSync(10)
    //doi lai password = password sau bam (hash)
    this.password = await bcrypt.hash(this.password, salt)
})

//Export the model
module.exports = mongoose.model('User', userSchema);