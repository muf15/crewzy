import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, ChevronDown, ArrowRight, Sparkles, Users, Target, Award } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import FeaturesSection from './FeaturesSection';
const HeroLanding = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const yText = useTransform(scrollY, [0, 300], [0, -50]);
  const yVideo = useTransform(scrollY, [0, 300], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  useEffect(() => {
    // Auto-play video after component mounts
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleVideoPlayback = () => {
    const video = document.getElementById('hero-video');
    if (video) {
      if (isVideoPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleMute = () => {
    const video = document.getElementById('hero-video');
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (<>
  <div>
        <Navbar />
  </div>
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F4F7FF] via-[#FEFEFE] to-[#E3EAFE]">
      {/* Video Background */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ y: yVideo }}
      >
        <div className="relative w-full h-full">
          {/* Video Element */}
          <video
            id="hero-video"
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted={isMuted}
            loop
            playsInline
            style={{
              filter: 'brightness(0.4) contrast(1.1)',
              transform: 'scale(1.05)'
            }}
            onLoadedData={() => setIsVideoLoaded(true)}
          >
            <source src="./src/assets/286688_small.mp4" type="video/mp4" />
            {/* Replace with your video URL */}
            {/* <source src="YOUR_VIDEO_URL_HERE.mp4" type="video/mp4" /> */}
            Your browser does not support the video tag.
          </video>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#4786FA]/10 via-[#E3EAFE]/20 to-[#F4F7FF]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FEFEFE]/5 via-transparent to-[#D1DFFA]/10" />
        </div>

        {/* Video Controls */}
        <motion.div 
          className="absolute bottom-6 right-6 flex space-x-2 z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <motion.button
            onClick={toggleVideoPlayback}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-[#FFFFFF]/20 backdrop-blur-md border border-[#FFFFFF]/30 flex items-center justify-center text-white hover:bg-[#FFFFFF]/30 transition-all duration-300 shadow-lg"
          >
            {isVideoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </motion.button>
          
          <motion.button
            onClick={toggleMute}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-[#FFFFFF]/20 backdrop-blur-md border border-[#FFFFFF]/30 flex items-center justify-center text-white hover:bg-[#FFFFFF]/30 transition-all duration-300 shadow-lg"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8"
        style={{ y: yText, opacity }}
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-[#FFFFFF]/10 backdrop-blur-md border border-[#FFFFFF]/20 rounded-full px-6 py-3 mb-8 shadow-xl"
          >
            <Sparkles className="w-5 h-5 text-[#F4F7FF]" />
            <span className="text-[#FFFFFF] font-medium text-sm sm:text-base">
              Next Generation Organization Management
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#FFFFFF] mb-6 leading-tight"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="block"
            >
              Transform Your
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="block bg-gradient-to-r from-[#E3EAFE] to-[#F4F7FF] bg-clip-text text-transparent"
            >
              Organization
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-lg sm:text-xl md:text-2xl text-[#F4F7FF]/90 mb-8 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Revolutionize your workplace with Crewzy's intelligent management platform. 
            Streamline operations, boost productivity, and create the future of work today.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12 max-w-2xl mx-auto"
          >
            {[
              { icon: Users, number: "10K+", label: "Active Users" },
              { icon: Target, number: "99.9%", label: "Uptime" },
              { icon: Award, number: "50+", label: "Companies" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.4 + (index * 0.2) }}
                className="bg-[#FFFFFF]/10 backdrop-blur-md border border-[#FFFFFF]/20 rounded-2xl p-6 text-center"
              >
                <stat.icon className="w-8 h-8 text-[#E3EAFE] mx-auto mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] mb-1">
                  {stat.number}
                </div>
                <div className="text-[#F4F7FF]/80 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            {/* About Us Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gradient-to-r from-[#4786FA] to-[#D1DFFA] text-[#FFFFFF] px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-[#4786FA]/25 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>About Us</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF]/10 to-[#FFFFFF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            {/* Secondary Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-[#FFFFFF]/10 backdrop-blur-md border-2 border-[#FFFFFF]/30 text-[#FFFFFF] px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-[#FFFFFF]/20 hover:border-[#FFFFFF]/50 transition-all duration-300"
            >
              <span className="flex items-center space-x-2">
                <span>Watch Demo</span>
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
      
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#FFFFFF]/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Loading Overlay */}
      {!isVideoLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-[#F4F7FF] via-[#FEFEFE] to-[#E3EAFE] flex items-center justify-center z-50"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-[#4786FA]/20 border-t-[#4786FA] rounded-full mx-auto mb-4"
            />
            <p className="text-[#4786FA] font-medium">Loading Experience...</p>
          </div>
        </motion.div>
      )}
    </div>
    <FeaturesSection/>
    </>
  );
};

export default HeroLanding;
