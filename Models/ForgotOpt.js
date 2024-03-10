import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const ForgotOptSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    opt: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '1h', // Token expires after 1 hour
    },
  });
  
  const ForgotOpt = mongoose.model('ForgotOpt', ForgotOptSchema);
  
  export { ForgotOpt }; // Adjusted export statement