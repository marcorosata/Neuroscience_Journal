import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, ExternalLink } from "lucide-react";
import { formatDate, getCategoryColor } from "@/lib/utils";

interface PreviewCardProps {
  title: string;
  description?: string;
  category?: string;
  authors?: string[];
  publishedAt?: string;
  readTime?: string;
  imageUrl?: string;
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PreviewCard({
  title,
  description,
  category,
  authors,
  publishedAt,
  readTime,
  imageUrl,
  href,
  className = "",
  children
}: PreviewCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const cardVariants = {
    rest: {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      z: 0,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    hover: {
      scale: 1.08,
      rotateX: (mousePosition.y - 150) / 30,
      rotateY: (mousePosition.x - 150) / 30,
      z: 50,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(255, 66, 75, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const overlayVariants = {
    rest: {
      opacity: 0,
      scale: 0.8,
    },
    hover: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  return (
    <div className={`relative ${className}`} style={{ perspective: "1000px" }}>
      <motion.div
        ref={cardRef}
        variants={cardVariants}
        initial="rest"
        animate={isHovered ? "hover" : "rest"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        className="relative"
      >
        <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-2xl transition-shadow duration-300">
          {imageUrl && (
            <div className="h-48 overflow-hidden">
              <motion.img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
                animate={{
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
          
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {category && (
                <Badge 
                  className={`${getCategoryColor(category)} text-white font-medium`}
                >
                  {category}
                </Badge>
              )}
            </div>
            
            <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2">
              {title}
            </h3>
            
            {description && (
              <p className="text-gray-600 mb-4 line-clamp-3">
                {description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {authors && authors.length > 0 && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{authors.slice(0, 2).join(", ")}</span>
                  {authors.length > 2 && <span>+{authors.length - 2}</span>}
                </div>
              )}
              
              {publishedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(publishedAt)}</span>
                </div>
              )}
              
              {readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{readTime}</span>
                </div>
              )}
            </div>
            
            {children}
          </CardContent>
        </Card>

        {/* Hover overlay with additional info */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              variants={overlayVariants}
              initial="rest"
              animate="hover"
              exit="rest"
              className="absolute inset-0 bg-gradient-to-br from-red-impact/95 via-berry/90 to-maroon/95 rounded-xl flex items-center justify-center text-white"
            >
              <div className="text-center p-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <ExternalLink className="h-8 w-8" />
                </motion.div>
                
                <motion.h4
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-bold text-lg mb-2"
                >
                  {title}
                </motion.h4>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/90 text-sm"
                >
                  Click to read more
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Grid layout for preview cards with staggered animations
interface PreviewGridProps {
  children: React.ReactNode[];
  columns?: number;
  gap?: number;
  className?: string;
}

export function PreviewGrid({ 
  children, 
  columns = 3, 
  gap = 6,
  className = "" 
}: PreviewGridProps) {
  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-${columns} gap-${gap} ${className}`}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.5,
            ease: "easeOut"
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}