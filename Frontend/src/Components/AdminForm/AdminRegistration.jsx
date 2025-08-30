import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Building, User, Mail, Lock, Phone, MapPin } from 'lucide-react';
import { organizationAPI } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const AdminRegistration = () => {
  const navigate = useNavigate();
  
  // Organization state
  const [organizationData, setOrganizationData] = useState({
    name: '',
    type: '',
    size: '',
    website: '',
    address: ''
  });

  // Admin users state
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: '',
      email: '',
      password: '',
      role: 'Admin'
    }
  ]);

  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  // Handle organization data changes
  const handleOrganizationChange = (field, value) => {
    setOrganizationData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const addAdmin = () => {
    const newAdmin = {
      id: Date.now(),
      name: '',
      email: '',
      password: '',
      role: 'Admin'
    };
    setAdmins([...admins, newAdmin]);
  };

  const removeAdmin = (id) => {
    if (admins.length > 1) {
      setAdmins(admins.filter(admin => admin.id !== id));
    }
  };

  const updateAdmin = (id, field, value) => {
    setAdmins(admins.map(admin => 
      admin.id === id ? { ...admin, [field]: value } : admin
    ));
    // Clear admin error when user starts typing
    if (errors[`admin_${id}_${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`admin_${id}_${field}`]: null
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Validate organization data
    if (!organizationData.name.trim()) {
      newErrors.name = 'Organization name is required';
    }
    if (!organizationData.type) {
      newErrors.type = 'Industry type is required';
    }
    if (!organizationData.size) {
      newErrors.size = 'Company size is required';
    }
    if (!organizationData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (organizationData.website && !isValidUrl(organizationData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    // Validate admin data
    admins.forEach(admin => {
      if (!admin.name.trim()) {
        newErrors[`admin_${admin.id}_name`] = 'Admin name is required';
      }
      if (!admin.email.trim()) {
        newErrors[`admin_${admin.id}_email`] = 'Email is required';
      } else if (!isValidEmail(admin.email)) {
        newErrors[`admin_${admin.id}_email`] = 'Please enter a valid email';
      }
      if (!admin.password.trim()) {
        newErrors[`admin_${admin.id}_password`] = 'Password is required';
      } else if (admin.password.length < 6) {
        newErrors[`admin_${admin.id}_password`] = 'Password must be at least 6 characters';
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

  // Handle form submission - READY FOR BACKEND INTEGRATION
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Prepare data for API call
    const apiPayload = {
      organization: {
        name: organizationData.name.trim(),
        industry_type: organizationData.type,
        company_size: organizationData.size,
        website: organizationData.website.trim() || null,
        full_address: organizationData.address.trim()
      },
      admins: admins.map(admin => ({
        name: admin.name.trim(),
        email: admin.email.trim().toLowerCase(),
        password: admin.password,
        role: admin.role,
        organization_name: organizationData.name.trim() // Auto-filled
      }))
    };

    try {
      // TODO: Replace with actual API endpoint
      console.log('=== READY FOR BACKEND INTEGRATION ===');
      console.log('API Payload:', JSON.stringify(apiPayload, null, 2));
      
      // Example API call structure:
      /*
      const response = await fetch('/api/organizations/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const result = await response.json();
      console.log('Registration successful:', result);
      
      // Redirect to success page or dashboard
      // navigate('/dashboard');
      */

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('✅ Registration successful! (This is a demo - connect to your backend API)');
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('❌ Registration failed. Please try again.');
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
          <p className="text-[#4786FA] text-lg opacity-80">Complete your organization setup and add admin users</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Success/Error Message */}
          {submitMessage.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border ${
                submitMessage.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
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
              <h2 className="text-2xl md:text-3xl font-bold text-[#4786FA]">Organization Information</h2>
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
                  onChange={(e) => handleOrganizationChange('name', e.target.value)}
                  className={`w-full px-4 py-4 bg-[#F4F7FF] border-2 rounded-2xl focus:outline-none transition-all duration-300 text-[#4786FA] placeholder-[#D1DFFA] ${
                    errors.name ? 'border-red-500' : 'border-[#E2E9F9] focus:border-[#4786FA]'
                  }`}
                  placeholder="Enter organization name"
                  required
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </motion.div>

              {/* Industry/Type */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="space-y-2"
              >
                <label className="block text-sm font-semibold text-[#4786FA] mb-2">
                  Industry/Type *
                </label>
                <select
                  value={organizationData.type}
                  onChange={(e) => handleOrganizationChange('type', e.target.value)}
                  className={`w-full px-4 py-4 bg-[#F4F7FF] border-2 rounded-2xl focus:outline-none transition-all duration-300 text-[#4786FA] ${
                    errors.type ? 'border-red-500' : 'border-[#E2E9F9] focus:border-[#4786FA]'
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
                  <option value="other">Other</option>
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
              </motion.div>

              {/* Business Category/Content Area */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="space-y-2"
              >
                <label className="block text-sm font-semibold text-[#4786FA] mb-2">
                  Company Size *
                </label>
                <select
                  value={organizationData.size}
                  onChange={(e) => handleOrganizationChange('size', e.target.value)}
                  className={`w-full px-4 py-4 bg-[#F4F7FF] border-2 rounded-2xl focus:outline-none transition-all duration-300 text-[#4786FA] ${
                    errors.size ? 'border-red-500' : 'border-[#E2E9F9] focus:border-[#4786FA]'
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
                {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
              </motion.div>

              {/* Website Type */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="space-y-2"
              >
                <label className="block text-sm font-semibold text-[#4786FA] mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  value={organizationData.website}
                  onChange={(e) => handleOrganizationChange('website', e.target.value)}
                  className={`w-full px-4 py-4 bg-[#F4F7FF] border-2 rounded-2xl focus:outline-none transition-all duration-300 text-[#4786FA] placeholder-[#D1DFFA] ${
                    errors.website ? 'border-red-500' : 'border-[#E2E9F9] focus:border-[#4786FA]'
                  }`}
                  placeholder="https://example.com"
                />
                {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
              </motion.div>
            </div>

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
              <textarea
                value={organizationData.address}
                onChange={(e) => handleOrganizationChange('address', e.target.value)}
                rows={3}
                className={`w-full px-4 py-4 bg-[#F4F7FF] border-2 rounded-2xl focus:outline-none transition-all duration-300 text-[#4786FA] placeholder-[#D1DFFA] resize-none ${
                  errors.address ? 'border-red-500' : 'border-[#E2E9F9] focus:border-[#4786FA]'
                }`}
                placeholder="Enter complete organization address"
                required
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
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
                <h2 className="text-2xl md:text-3xl font-bold text-[#4786FA]">Admin Users</h2>
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
                    <h3 className="text-lg font-bold text-[#4786FA]">Admin {index + 1}</h3>
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
                        onChange={(e) => updateAdmin(admin.id, 'name', e.target.value)}
                        className={`w-full px-4 py-3 bg-[#FFFFFF] border-2 rounded-xl focus:outline-none transition-all duration-300 text-[#4786FA] placeholder-[#D1DFFA] ${
                          errors[`admin_${admin.id}_name`] ? 'border-red-500' : 'border-[#E2E9F9] focus:border-[#4786FA]'
                        }`}
                        placeholder="Admin full name"
                        required
                      />
                      {errors[`admin_${admin.id}_name`] && <p className="text-red-500 text-sm mt-1">{errors[`admin_${admin.id}_name`]}</p>}
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
                        onChange={(e) => updateAdmin(admin.id, 'email', e.target.value)}
                        className={`w-full px-4 py-3 bg-[#FFFFFF] border-2 rounded-xl focus:outline-none transition-all duration-300 text-[#4786FA] placeholder-[#D1DFFA] ${
                          errors[`admin_${admin.id}_email`] ? 'border-red-500' : 'border-[#E2E9F9] focus:border-[#4786FA]'
                        }`}
                        placeholder="admin@company.com"
                        required
                      />
                      {errors[`admin_${admin.id}_email`] && <p className="text-red-500 text-sm mt-1">{errors[`admin_${admin.id}_email`]}</p>}
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
                        onChange={(e) => updateAdmin(admin.id, 'password', e.target.value)}
                        className={`w-full px-4 py-3 bg-[#FFFFFF] border-2 rounded-xl focus:outline-none transition-all duration-300 text-[#4786FA] placeholder-[#D1DFFA] ${
                          errors[`admin_${admin.id}_password`] ? 'border-red-500' : 'border-[#E2E9F9] focus:border-[#4786FA]'
                        }`}
                        placeholder="Create strong password"
                        required
                      />
                      {errors[`admin_${admin.id}_password`] && <p className="text-red-500 text-sm mt-1">{errors[`admin_${admin.id}_password`]}</p>}
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
                  ? 'bg-[#D1DFFA] text-[#4786FA] cursor-not-allowed' 
                  : 'bg-[#4786FA] text-white hover:shadow-3xl hover:-translate-y-1 hover:bg-[#3B75E8]'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#4786FA] border-t-transparent rounded-full animate-spin"></div>
                  Registering...
                </div>
              ) : (
                'Complete Registration'
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
