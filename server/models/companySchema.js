import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  industryType: {
    type: String,
    required: true,
  },
  businessEmail: [
    {
      type: String,
      required: true,
    }
  ],
  contactNos: [
    {
      type: String,
      required: true,
    }
  ],
  companySize: {
    type: String,
    required: true,
  },
  fullAddress: {
    type: String,
    required: true,
  },
  workForceType: [
    {
      type: String,
      required: true,
    }
  ]
});

const Company = mongoose.model("Company", companySchema);

export default Company;