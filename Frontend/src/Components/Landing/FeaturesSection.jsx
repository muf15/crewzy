import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  Users, 
  Clock, 
  BarChart3, 
  Shield, 
  Zap, 
  Heart, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const features = [
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Connect your team with seamless communication tools and real-time collaboration features that boost productivity.",
      color: "#4786FA",
      bgColor: "#E3EAFE",
      stats: "95% improved communication"
    },
    {
      icon: Clock,
      title: "Time Management",
      description: "Advanced time tracking and scheduling system that helps you optimize workflows and manage deadlines effectively.",
      color: "#D1DFFA",
      bgColor: "#F4F7FF",
      stats: "40% time saved daily"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Powerful analytics dashboard providing deep insights into team performance and organizational growth metrics.",
      color: "#4786FA",
      bgColor: "#D1E1FB",
      stats: "200% better decisions"
    },
    {
      icon: Shield,
      title: "Security First",
      description: "Enterprise-grade security with end-to-end encryption, ensuring your organizational data remains protected.",
      color: "#E2E9F9",
      bgColor: "#F2F5FC",
      stats: "99.9% security uptime"
    }
  ];

  const benefitsList = [
    "Streamlined workflow automation",
    "Real-time performance monitoring",
    "Scalable team management",
    "Advanced reporting system",
    "24/7 customer support",
    "Mobile-first approach"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#F4F7FF] via-[#FEFEFE] to-[#E3EAFE] py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-[#E3EAFE] to-[#D1DFFA] blur-xl"></div>
        <div className="absolute top-60 right-20 w-48 h-48 rounded-full bg-gradient-to-r from-[#D1E1FB] to-[#F2F5FC] blur-2xl"></div>
        <div className="absolute bottom-40 left-1/3 w-64 h-64 rounded-full bg-gradient-to-r from-[#F4F7FF] to-[#E2E9F9] blur-3xl"></div>
      </div>

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#E3EAFE] to-[#D1DFFA] rounded-full px-6 py-3 mb-8"
          >
            <Sparkles className="w-5 h-5 text-[#4786FA]" />
            <span className="text-[#4786FA] font-medium">Powerful Features</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="block"
            >
              Everything You Need
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="block bg-gradient-to-r from-[#4786FA] to-[#D1DFFA] bg-clip-text text-transparent"
            >
              To Succeed Together
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Discover how Crewzy transforms the way teams work together with innovative features 
            designed to boost productivity and streamline organizational workflows.
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch mb-20">
          {/* Left Side - Image Placeholder */}
          <motion.div
            style={{ y, opacity }}
            className="relative h-full min-h-[500px] lg:min-h-[600px]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative h-full bg-gradient-to-br from-[#E3EAFE] to-[#D1DFFA] rounded-3xl p-4 shadow-2xl border border-[#E2E9F9] overflow-hidden"
            >
              {/* Image Container */}
              <div className="w-full h-full bg-gradient-to-br from-[#F4F7FF] to-[#E3EAFE] rounded-2xl flex items-center justify-center">
                <img 
                  src="./src/assets/istockphoto-1427848488-612x612.jpg"
                  className="w-full h-full object-cover rounded-2xl"
                  // Replace with your actual image URL
                  // src="YOUR_IMAGE_URL_HERE"
                />
                {/* Fallback content when image loads */}
                <div className="absolute inset-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-[#4786FA] to-[#D1DFFA] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-[#4786FA] font-medium text-lg">
                      Team Collaboration Image
                    </p>
                    <p className="text-[#4786FA]/60 text-sm mt-1">
                      Replace with your image URL
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Badges */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={isInView ? { scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.8 }}
                className="absolute top-6 right-6 bg-gradient-to-r from-[#4786FA] to-[#D1DFFA] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              >
                ✨ Live Collaboration
              </motion.div>

              <motion.div
                initial={{ scale: 0, rotate: 10 }}
                animate={isInView ? { scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.6, delay: 2 }}
                className="absolute bottom-6 left-6 bg-gradient-to-r from-[#E3EAFE] to-[#D1E1FB] text-[#4786FA] px-4 py-2 rounded-full text-sm font-medium border border-[#E2E9F9] shadow-lg"
              >
                🚀 Real-time Updates
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side - Features List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                  className={`group relative bg-gradient-to-r from-[#F4F7FF] to-[#E3EAFE] rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                    activeFeature === index 
                      ? 'border-[#4786FA] shadow-xl scale-105' 
                      : 'border-[#E2E9F9] hover:border-[#D1DFFA] hover:shadow-lg'
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start space-x-4">
                    <motion.div
                      animate={activeFeature === index ? { rotate: 360 } : {}}
                      transition={{ duration: 0.6 }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        activeFeature === index 
                          ? 'bg-gradient-to-r from-[#4786FA] to-[#D1DFFA]' 
                          : 'bg-gradient-to-r from-[#E3EAFE] to-[#F2F5FC]'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${
                        activeFeature === index ? 'text-white' : 'text-[#4786FA]'
                      }`} />
                    </motion.div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-3 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#4786FA] bg-gradient-to-r from-[#E3EAFE] to-[#D1E1FB] px-3 py-1 rounded-full">
                          {feature.stats}
                        </span>
                        <ArrowRight className={`w-4 h-4 transition-all duration-300 ${
                          activeFeature === index 
                            ? 'text-[#4786FA] translate-x-1' 
                            : 'text-[#E2E9F9] group-hover:translate-x-1 group-hover:text-[#4786FA]'
                        }`} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="bg-gradient-to-r from-[#F4F7FF] to-[#E3EAFE] rounded-3xl p-8 md:p-12 border border-[#E2E9F9] shadow-xl"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Teams Love Crewzy
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join thousands of successful organizations that have transformed their workflow with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefitsList.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 1.4 + (index * 0.1) }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex items-center space-x-3 bg-gradient-to-r from-[#D1E1FB] to-[#E3EAFE] rounded-xl p-4 border border-[#E2E9F9] hover:shadow-lg transition-all duration-300"
              >
                <CheckCircle className="w-6 h-6 text-[#4786FA] flex-shrink-0" />
                <span className="text-gray-700 font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#4786FA]/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
