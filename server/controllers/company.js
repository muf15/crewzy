import Company from "../models/companySchema.js";

export const registerCompany = async (req, res) => {
  try {
    console.log("Company registration request body:", req.body);
    const { 
      name, 
      industryType, 
      businessEmail, 
      contactNos, 
      companySize, 
      fullAddress, 
      workForceType,
      pincode,
      eLoc,
      coordinates
    } = req.body;
    
    const companyData = {
      name,
      industryType,
      businessEmail,
      contactNos,
      companySize,
      fullAddress,
      workForceType
    };

    // Add optional location fields if provided
    if (pincode) companyData.pincode = pincode;
    if (eLoc) companyData.eLoc = eLoc;
    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      companyData.coordinates = coordinates;
    }

    console.log("Creating company with data:", companyData);
    const company = new Company(companyData);
    await company.save();
    
    res.status(201).json({ message: "Company registered successfully", company });
  } catch (error) {
    console.error("Company registration error:", error);
    res.status(400).json({ error: error.message });
  }
};