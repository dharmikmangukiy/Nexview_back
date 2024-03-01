import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "customer" },
    type: { type: String, default: "new user" },
    plan: { type: String, default: "free Plan" },
    paymentType: { type: String, },
    paymentTransactionId: { type: String },
    planStartDate: { type: String },
    planEndDate: { type: String },
    IP: { type: String },
    image_src: { type: String, default: null },
    init_vector: { type: String },
    face_descriptor: { type: String },
    timestamp: { type: Date, default: new Date() },
    profile:{type: String},
    favorite:{type: Array, default:[]}
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema, "users");
