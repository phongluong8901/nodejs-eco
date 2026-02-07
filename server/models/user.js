// !mdbgum
const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const crypto = require('crypto')

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
    cart: [
        {
            product: {type: mongoose.Types.ObjectId, ref: 'Product'},
            quantity: Number,
            color: String,
        }
    ],
    // address: {
    //     type: Array,
    //     default: []
    // },
    address: String,
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
    registerToken: {
        type:String,
    },
}, {timestamps: true}
);

// truoc khi luu se thuc hien cac ham
userSchema.pre('save', async function(next) {
    // Nếu không đổi pass thì thoát luôn
    if (!this.isModified('password')) return next();

    // Dùng hash đồng bộ để tránh lỗi callback
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    
    // next();
});

userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password)    //so sanh 2 ngam -> T or F
    },
    createPasswordChangedToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExpires = new Date(Date.now() + 15*60*1000)//15p -> milisecond
        return resetToken
    }
} 



//Export the model
module.exports = mongoose.model('User', userSchema);