import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Building,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Navigation,
} from "lucide-react";
import { companyAPI, authAPI } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import {
  getCurrentLocation,
  getAddressFromCoordinates,
} from "../../utils/locationUtils";

const AdminRegistration = () => {
  const navigate = useNavigate();

  // Organization state - Updated to match backend companySchema
  const [organizationData, setOrganizationData] = useState({
    name: "",
    industryType: "",
    businessEmail: [""],
    contactNos: [""],
    companySize: "",
    fullAddress: "",
    workForceType: [],
    pincode: "",
    eLoc: "",
    coordinates: [],
  });

  // Location state
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Mappls API key - You should store this in environment variables
  const MAPPLS_API_KEY = import.meta.env.VITE_MAPPLS_API_KEY;

  // Admin users state - Updated to match backend userSchema
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: "",
      email: "",
      password: "",
      role: "admin", // Fixed to match backend enum
      organization: "",
      subRole: "",
      workType: "office", // Default value from enum
    },
  ]);

  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  // Handle organization data changes
  const handleOrganizationChange = (field, value) => {
    setOrganizationData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Handle email array changes
  const handleEmailChange = (index, value) => {
    const newEmails = [...organizationData.businessEmail];
    newEmails[index] = value;
    setOrganizationData((prev) => ({
      ...prev,
      businessEmail: newEmails,
    }));
  };

  // Add new email field
  const addEmailField = () => {
    setOrganizationData((prev) => ({
      ...prev,
      businessEmail: [...prev.businessEmail, ""],
    }));
  };

  // Remove email field
  const removeEmailField = (index) => {
    if (organizationData.businessEmail.length > 1) {
      const newEmails = organizationData.businessEmail.filter(
        (_, i) => i !== index
      );
      setOrganizationData((prev) => ({
        ...prev,
        businessEmail: newEmails,
      }));
    }
  };

  // Handle contact number array changes
  const handleContactChange = (index, value) => {
    const newContacts = [...organizationData.contactNos];
    newContacts[index] = value;
    setOrganizationData((prev) => ({
      ...prev,
      contactNos: newContacts,
    }));
  };

  // Add new contact field
  const addContactField = () => {
    setOrganizationData((prev) => ({
      ...prev,
      contactNos: [...prev.contactNos, ""],
    }));
  };

  // Remove contact field
  const removeContactField = (index) => {
    if (organizationData.contactNos.length > 1) {
      const newContacts = organizationData.contactNos.filter(
        (_, i) => i !== index
      );
      setOrganizationData((prev) => ({
        ...prev,
        contactNos: newContacts,
      }));
    }
  };

  // Handle workforce type changes
  const handleWorkForceTypeChange = (type, checked) => {
    if (checked) {
      setOrganizationData((prev) => ({
        ...prev,
        workForceType: [...prev.workForceType, type],
      }));
    } else {
      setOrganizationData((prev) => ({
        ...prev,
        workForceType: prev.workForceType.filter((t) => t !== type),
      }));
    }
  };

  // Handle location fetching
  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    setLocationError("");

    try {
      // Get current location
      const location = await getCurrentLocation();
      console.log("Current location:", location);

      // Get address from coordinates using Mappls API
      const addressData = await getAddressFromCoordinates(
        location.latitude,
        location.longitude
      );

      // Update organization data with fetched address and coordinates
      setOrganizationData((prev) => ({
        ...prev,
        fullAddress: addressData.fullAddress,
        pincode: addressData.pincode,
        eLoc: addressData.eLoc,
        coordinates: addressData.coordinates,
      }));

      console.log("6 digit pin:", addressData.pincode);
      console.log("6 digit eLoc (Mappls code):", addressData.eLoc);
      console.log("Address fetched:", addressData);
    } catch (error) {
      console.error("Location error:", error);
      setLocationError(error.message);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const addAdmin = () => {
    const newAdmin = {
      id: Date.now(),
      name: "",
      email: "",
      password: "",
      role: "admin",
      organization: organizationData.name,
      subRole: "",
      workType: "office",
    };
    setAdmins([...admins, newAdmin]);
  };

  const removeAdmin = (id) => {
    if (admins.length > 1) {
      setAdmins(admins.filter((admin) => admin.id !== id));
    }
  };

  const updateAdmin = (id, field, value) => {
    setAdmins(
      admins.map((admin) =>
        admin.id === id ? { ...admin, [field]: value } : admin
      )
    );
    // Clear admin error when user starts typing
    if (errors[`admin_${id}_${field}`]) {
      setErrors((prev) => ({
        ...prev,
        [`admin_${id}_${field}`]: null,
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Validate organization data
    if (!organizationData.name.trim()) {
      newErrors.name = "Organization name is required";
    }
    if (!organizationData.industryType) {
      newErrors.industryType = "Industry type is required";
    }
    if (!organizationData.companySize) {
      newErrors.companySize = "Company size is required";
    }
    if (!organizationData.fullAddress.trim()) {
      newErrors.fullAddress = "Address is required";
    }

    // Validate business emails
    organizationData.businessEmail.forEach((email, index) => {
      if (!email.trim()) {
        newErrors[`businessEmail_${index}`] = "Business email is required";
      } else if (!isValidEmail(email)) {
        newErrors[`businessEmail_${index}`] = "Please enter a valid email";
      }
    });

    // Validate contact numbers
    organizationData.contactNos.forEach((contact, index) => {
      if (!contact.trim()) {
        newErrors[`contactNos_${index}`] = "Contact number is required";
      } else if (!/^\d{10}$/.test(contact.replace(/\D/g, ""))) {
        newErrors[`contactNos_${index}`] =
          "Please enter a valid 10-digit phone number";
      }
    });

    // Validate workforce type
    if (organizationData.workForceType.length === 0) {
      newErrors.workForceType = "Please select at least one workforce type";
    }

    // Validate admin data
    admins.forEach((admin) => {
      if (!admin.name.trim()) {
        newErrors[`admin_${admin.id}_name`] = "Admin name is required";
      }
      if (!admin.email.trim()) {
        newErrors[`admin_${admin.id}_email`] = "Email is required";
      } else if (!isValidEmail(admin.email)) {
        newErrors[`admin_${admin.id}_email`] = "Please enter a valid email";
      }
      if (!admin.password.trim()) {
        newErrors[`admin_${admin.id}_password`] = "Password is required";
      } else if (admin.password.length < 6) {
        newErrors[`admin_${admin.id}_password`] =
          "Password must be at least 6 characters";
      }
      if (!admin.subRole.trim()) {
        newErrors[`admin_${admin.id}_subRole`] = "Sub role is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Utility functions
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle form submission - BACKEND INTEGRATION IMPLEMENTED
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    try {
      // Step 1: Register the company first
      const companyPayload = {
        name: organizationData.name.trim(),
        industryType: organizationData.industryType,
        businessEmail: organizationData.businessEmail.filter((email) =>
          email.trim()
        ),
        contactNos: organizationData.contactNos.filter((contact) =>
          contact.trim()
        ),
        companySize: organizationData.companySize,
        fullAddress: organizationData.fullAddress.trim(),
        workForceType: organizationData.workForceType,
        pincode: organizationData.pincode,
        eLoc: organizationData.eLoc,
        coordinates: organizationData.coordinates,
      };

      console.log("Registering company:", companyPayload);
      const companyResponse = await companyAPI.register(companyPayload);
      console.log("Company registered successfully:", companyResponse.data);

      // Step 2: Register admins one by one using Promise.all for parallel execution
      const adminPromises = admins.map(async (admin) => {
        const adminPayload = {
          name: admin.name.trim(),
          email: admin.email.trim().toLowerCase(),
          password: admin.password,
          role: "admin", // Fixed to match backend enum
          organization: organizationData.name.trim(),
          subRole: admin.subRole.trim(),
          workType: admin.workType,
        };

        console.log("Registering admin:", adminPayload);
        return authAPI.signup(adminPayload);
      });

      // Execute all admin registrations
      const adminResponses = await Promise.all(adminPromises);
      console.log(
        "All admins registered successfully:",
        adminResponses.map((r) => r.data)
      );

      setSubmitMessage({
        type: "success",
        text: `✅ Registration successful! Company and ${admins.length} admin(s) registered successfully.`,
      });

      // Reset form after successful submission
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSubmitMessage({
        type: "error",
        text: `❌ ${errorMessage}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7FF] via-[#FEFEFE] to-[#E3EAFE]">
      <Navbar />
      <div className="py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#4786FA] mb-4">
              Organization & Admin Registration
            </h1>
            <p className="text-[#4786FA] text-lg opacity-80">
              Complete your organization setup and add admin users
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Success/Error Message */}
            {submitMessage.text && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border ${
                  submitMessage.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {submitMessage.text}
              </motion.div>
            )}
            {/* Organization Information Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-[#FFFFFF] rounded-3xl shadow-2xl border border-[#E2E9F9] p-8 md:p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-[#4786FA] p-3 rounded-2xl">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#4786FA]">
                  Organization Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organization Name */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-semibold text-[#4786FA] mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={organizationData.name}
                    onChange={(e) =>
                      handleOrganizationChange("name", e.target.value)
                    }
                    className={`w-full px-4 py-4 bg-[#F4F7FF] border-2 rounded-2xl focus:outline-none transition-all duration-300 text-[#4786FA] placeholder-[#D1DFFA] ${
                      errors.name
                        ? "border-red-500"
                        : "border-[#E2E9F9] focus:border-[#4786FA]"
                    }`}
                    placeholder="Enter organization name"
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </motion.div>

                {/* Industry Type */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-semibold text-[#4786FA] mb-2">
                    Industry Type *
                  </label>
                  <select
                    value={organizationData.industryType}
                    onChange={(e) =>
                      handleOrganizationChange("industryType", e.target.value)
                    }
                    className={`w-full px-4 py-4 bg-[#F4F7FF] border-2 rounded-2xl focus:outline-none transition-all duration-300 text-[#4786FA] ${
                      errors.industryType
                        ? "border-red-500"
                        : "border-[#E2E9F9] focus:border-[#4786FA]"
                    }`}
                    required
                  >
                    <option value="">Select industry type</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.industryType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.industryType}
                    </p>
                  )}
                </motion.div>

                {/* Company Size */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-semibold text-[#4786FA] mb-2">
                    Company Size *
                  </label>
                  <select
                    value={organizationData.companySize}
                    onChange={(e) =>
                      handleOrganizationChange("companySize", e.target.value)
                    }
                    className={`w-full px-4 py-4 bg-[#F4F7FF] border-2 rounded-2xl focus:outline-none transition-all duration-300 text-[#4786FA] ${
                      errors.companySize
                        ? "border-red-500"
                        : "border-[#E2E9F9] focus:border-[#4786FA]"
                    }`}
                    required
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                  {errors.companySize && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.companySize}
                    </p>
                  )}
                </motion.div>

                {/* Workforce Type */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-semibold text-[#4786FA] mb-2">
                    Workforce Type *
                  </label>
                  <div className="space-y-2">
                    {[
                      "remote",
                      "office",
                      "hybrid",
                      "contract",
                      "freelance",
                    ].map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={organizationData.workForceType.includes(
                            type
                          )}
                          onChange={(e) =>
                            handleWorkForceTypeChange(type, e.target.checked)
                          }
                          className="rounded border-[#E2E9F9] text-[#4786FA] focus:ring-[#4786FA]"
                        />
                        <span className="text-[#4786FA] capitalize">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.workForceType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.workForceType}
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Business Emails */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mt-6 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-[#4786FA] mb-2">
                    <Mail className="inline w-4 h-4 mr-1" />
                    Business Email(s) *
                  </label>
                  <button
                    type="button"
                    onClick={addEmailField}
                    className="text-[#4786FA] hover:text-[#3B75E8] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {organizationData.businessEmail.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      className={`flex-1 px-4 py-3 bg-[#F4F7FF] border-2 rounded-2xl focus:outline-none transition-all duration-300 text-[#4786FA] placeholder-[#D1DFFA] ${
                        errors[`businessEmail_${index}`]
                          ? "border-red-500"
                          : "border-[#E2E9F9] focus:border-[#4786FA]"
                      }`}
                      placeholder="business@company.com"
                      required
                    />
                    {organizationData.businessEmail.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEmailField(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                {organizationData.businessEmail.some(
                  (_, index) => errors[`businessEmail_${index}`]
                ) && (
                  <p className="text-red-500 text-sm mt-1">
                    {
                      Object.keys(errors)
                        .filter((key) => key.startsWith("businessEmail_"))
                        .map((key) => errors[key])[0]
                    }
                  </p>
                )}
              </motion.div>

              {/* Contact Numbers */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mt-6 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-[#4786FA] mb-2">
                    <Phone className="inline w-4 h-4 mr-1" />
                    Contact Number(s) *
                  </label>
                  <button
                    type="button"
                    onClick={addContactField}
                    className="text-[#4786FA] hover:text-[#3B75E8] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {organizationData.contactNos.map((contact, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="tel"
                      value={contact}
                      onChange={(e) =>
                        handleContactChange(index, e.target.value)
                      }
                      className={`flex-1 px-4 py-3 bg-[#F4F7FF] border-2 rounded-2xl focus:outline-none transition-all duration-300 text-[#4786FA] placeholder-[#D1DFFA] ${
                        errors[`contactNos_${index}`]
                          ? "border-red-500"
                          : "border-[#E2E9F9] focus:border-[#4786FA]"
                      }`}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                    {organizationData.contactNos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContactField(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                {organizationData.contactNos.some(
                  (_, index) => errors[`contactNos_${index}`]
                ) && (
                  <p className="text-red-500 text-sm mt-1">
                    {
                      Object.keys(errors)
                        .filter((key) => key.startsWith("contactNos_"))
                        .map((key) => errors[key])[0]
                    }
                  </p>
                )}
              </motion.div>

              {/* Full Address */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mt-6 space-y-2"
              >
                <label className="block text-sm font-semibold text-[#4786FA] mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Full Address *
                </label>
                <div className="flex gap-2">
                  <textarea
                    value={organizationData.fullAddress}
                    onChange={(e) =>
                      handleOrganizationChange("fullAddress", e.target.value)
                    }
                    rows={3}
                    className={`flex-1 px-4 py-4 bg-[#F4F7FF] border-2 rounded-2xl focus:outline-none transition-all duration-300 text-[#4786FA] placeholder-[#D1DFFA] resize-none ${
                      errors.fullAddress
                        ? "border-red-500"
                        : "border-[#E2E9F9] focus:border-[#4786FA]"
                    }`}
                    placeholder="Enter complete organization address or use current location"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={isGettingLocation}
                    whileHover={{ scale: isGettingLocation ? 1 : 1.05 }}
                    whileTap={{ scale: isGettingLocation ? 1 : 0.95 }}
                    className={`px-4 py-2 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                      isGettingLocation
                        ? "bg-[#D1DFFA] text-[#4786FA] cursor-not-allowed"
                        : "bg-[#4786FA] text-white hover:bg-[#3B75E8] shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {isGettingLocation ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#4786FA] border-t-transparent rounded-full animate-spin"></div>
                        Getting...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4" />
                        Use Current Location
                      </>
                    )}
                  </motion.button>
                </div>
                {errors.fullAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullAddress}
                  </p>
                )}
                {locationError && (
                  <p className="text-red-500 text-sm mt-1">{locationError}</p>
                )}
                {organizationData.pincode && (
                  <p className="text-green-600 text-sm mt-1">
                    📍 Pincode: {organizationData.pincode}
                  </p>
                )}
                {organizationData.eLoc && (
                  <p className="text-blue-600 text-sm mt-1">
                    🗺️ eLoc (6-digit code): {organizationData.eLoc}
                  </p>
                )}
              </motion.div>
            </motion.div>

            {/* Admin Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-[#FFFFFF] rounded-3xl shadow-2xl border border-[#E2E9F9] p-8 md:p-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-[#4786FA] p-3 rounded-2xl">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4786FA]">
                    Admin Users
                  </h2>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={addAdmin}
                  className="bg-[#4786FA] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:bg-[#3B75E8]"
                >
                  <Plus className="w-4 h-4" />
                  Add Admin
                </motion.button>
              </div>

              <AnimatePresence>
                {admins.map((admin, index) => (
                  <motion.div
                    key={admin.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#F4F7FF] rounded-2xl p-6 border-2 border-[#E2E9F9] mb-6 last:mb-0"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-[#4786FA]">
                        Admin {index + 1}
                      </h3>
                      {admins.length > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => removeAdmin(admin.id)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <label className="block text-sm font-semibold text-[#4786FA] mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={admin.name}
                          onChange={(e) =>
                            updateAdmin(admin.id, "name", e.target.value)
                          }
                          className={`w-full px-4 py-3 bg-[#FFFFFF] border-2 rounded-xl focus:outline-none transition-all duration-300 text-[#4786FA] placeholder-[#D1DFFA] ${
                            errors[`admin_${admin.id}_name`]
                              ? "border-red-500"
                              : "border-[#E2E9F9] focus:border-[#4786FA]"
                          }`}
                          placeholder="Admin full name"
                          required
                        />
                        {errors[`admin_${admin.id}_name`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`admin_${admin.id}_name`]}
                          </p>
                        )}
                      </motion.div>

                      {/* Email */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <label className="block text-sm font-semibold text-[#4786FA] mb-2">
                          <Mail className="inline w-4 h-4 mr-1" />
                          Email ID *
                        </label>
                        <input
                          type="email"
                          value={admin.email}
                          onChange={(e) =>
                            updateAdmin(admin.id, "email", e.target.value)
                          }
                          className={`w-full px-4 py-3 bg-[#FFFFFF] border-2 rounded-xl focus:outline-none transition-all duration-300 text-[#4786FA] placeholder-[#D1DFFA] ${
                            errors[`admin_${admin.id}_email`]
                              ? "border-red-500"
                              : "border-[#E2E9F9] focus:border-[#4786FA]"
                          }`}
                          placeholder="admin@company.com"
                          required
                        />
                        {errors[`admin_${admin.id}_email`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`admin_${admin.id}_email`]}
                          </p>
                        )}
                      </motion.div>

                      {/* Password */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <label className="block text-sm font-semibold text-[#4786FA] mb-2">
                          <Lock className="inline w-4 h-4 mr-1" />
                          Password *
                        </label>
                        <input
                          type="password"
                          value={admin.password}
                          onChange={(e) =>
                            updateAdmin(admin.id, "password", e.target.value)
                          }
                          className={`w-full px-4 py-3 bg-[#FFFFFF] border-2 rounded-xl focus:outline-none transition-all duration-300 text-[#4786FA] placeholder-[#D1DFFA] ${
                            errors[`admin_${admin.id}_password`]
                              ? "border-red-500"
                              : "border-[#E2E9F9] focus:border-[#4786FA]"
                          }`}
                          placeholder="Create strong password"
                          required
                        />
                        {errors[`admin_${admin.id}_password`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`admin_${admin.id}_password`]}
                          </p>
                        )}
                      </motion.div>

                      {/* Sub Role */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <label className="block text-sm font-semibold text-[#4786FA] mb-2">
                          Sub Role *
                        </label>
                        <input
                          type="text"
                          value={admin.subRole}
                          onChange={(e) =>
                            updateAdmin(admin.id, "subRole", e.target.value)
                          }
                          className={`w-full px-4 py-3 bg-[#FFFFFF] border-2 rounded-xl focus:outline-none transition-all duration-300 text-[#4786FA] placeholder-[#D1DFFA] ${
                            errors[`admin_${admin.id}_subRole`]
                              ? "border-red-500"
                              : "border-[#E2E9F9] focus:border-[#4786FA]"
                          }`}
                          placeholder="e.g., CEO, CTO, Manager"
                          required
                        />
                        {errors[`admin_${admin.id}_subRole`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`admin_${admin.id}_subRole`]}
                          </p>
                        )}
                      </motion.div>

                      {/* Work Type */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <label className="block text-sm font-semibold text-[#4786FA] mb-2">
                          Work Type *
                        </label>
                        <select
                          value={admin.workType}
                          onChange={(e) =>
                            updateAdmin(admin.id, "workType", e.target.value)
                          }
                          className={`w-full px-4 py-3 bg-[#FFFFFF] border-2 rounded-xl focus:outline-none transition-all duration-300 text-[#4786FA] ${
                            errors[`admin_${admin.id}_workType`]
                              ? "border-red-500"
                              : "border-[#E2E9F9] focus:border-[#4786FA]"
                          }`}
                          required
                        >
                          <option value="office">Office</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                        {errors[`admin_${admin.id}_workType`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`admin_${admin.id}_workType`]}
                          </p>
                        )}
                      </motion.div>

                      {/* Organization (Auto-filled) */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <label className="block text-sm font-semibold text-[#4786FA] mb-2">
                          Organization
                        </label>
                        <input
                          type="text"
                          value={organizationData.name}
                          readOnly
                          className="w-full px-4 py-3 bg-[#E2E9F9] border-2 border-[#E2E9F9] rounded-xl text-[#4786FA] cursor-not-allowed"
                          placeholder="Organization will auto-fill"
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className={`px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 transform ${
                  isSubmitting
                    ? "bg-[#D1DFFA] text-[#4786FA] cursor-not-allowed"
                    : "bg-[#4786FA] text-white hover:shadow-3xl hover:-translate-y-1 hover:bg-[#3B75E8]"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#4786FA] border-t-transparent rounded-full animate-spin"></div>
                    Registering...
                  </div>
                ) : (
                  "Complete Registration"
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminRegistration;
