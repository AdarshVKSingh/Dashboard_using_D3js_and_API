import React from 'react';
import { motion } from 'framer-motion';

const DashboardTitle = () => {
  return (
    
    <motion.h1
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Dashboard
    </motion.h1>
  );
};

export default DashboardTitle;

