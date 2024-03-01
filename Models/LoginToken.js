import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const loginTokenSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '1h', // Token expires after 1 hour
    },
  });
  
  const LoginToken = mongoose.model('LoginToken', loginTokenSchema);
  
  export { LoginToken }; // Adjusted export statement