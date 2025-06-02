import mongoose from "mongoose";
const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    gstNumber: { type: String },
    companyType: {
      type: String,
      enum: ["corporate", "individual"],
      default: "corporate",
    },
    notes: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    preferredContactMethod: {
      type: String,
      enum: ["email", "phone"],
      default: "email",
    },
    tags: [String],
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);

export default Client;
