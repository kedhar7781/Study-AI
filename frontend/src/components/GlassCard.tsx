import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverGlow?: boolean;
  onClick?: () => void;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverGlow = true,
  onClick,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={hoverGlow ? { 
        y: -4, 
        boxShadow: '0 12px 40px 0 rgba(108, 99, 255, 0.25)',
        borderColor: 'rgba(108, 99, 255, 0.3)'
      } : {}}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl p-6
        bg-cardLight dark:bg-cardDark
        glass-panel dark:glass-panel
        shadow-glass hover:shadow-glass-hover
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Background soft glow gradient element */}
      <div className="absolute -right-16 -top-16 -z-10 h-32 w-32 rounded-full bg-primary/10 blur-xl transition-all duration-300 group-hover:bg-primary/20" />
      <div className="absolute -left-16 -bottom-16 -z-10 h-32 w-32 rounded-full bg-secondary/10 blur-xl transition-all duration-300 group-hover:bg-secondary/20" />
      
      {children}
    </motion.div>
  );
};
