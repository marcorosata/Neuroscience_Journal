import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface StarlinkCardProps {
  title: string;
  description?: string;
  category?: string;
  authors?: string[];
  publishedAt?: string;
  readTime?: string;
  href?: string;
  className?: string;
}

export function StarlinkCard({
  title,
  description,
  category,
  authors,
  publishedAt,
  readTime,
  href,
  className = ""
}: StarlinkCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
    >
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 h-full">
        <CardContent className="p-6">
          {/* Category badge */}
          {category && (
            <Badge 
              variant="secondary"
              className="bg-white/10 text-white border-white/20 mb-4 text-xs font-medium"
            >
              {category}
            </Badge>
          )}
          
          {/* Title */}
          <h3 className="text-xl font-medium text-white mb-3 line-clamp-2 leading-tight">
            {title}
          </h3>
          
          {/* Description */}
          {description && (
            <p className="text-gray-400 mb-6 line-clamp-3 font-light leading-relaxed">
              {description}
            </p>
          )}
          
          {/* Meta information */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            {authors && authors.length > 0 && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span className="font-light">
                  {authors.slice(0, 2).join(", ")}
                  {authors.length > 2 && ` +${authors.length - 2}`}
                </span>
              </div>
            )}
            
            {publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="font-light">{formatDate(publishedAt)}</span>
              </div>
            )}
            
            {readTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="font-light">{readTime}</span>
              </div>
            )}
          </div>

          {/* Hover indicator */}
          <motion.div
            className="flex items-center text-white/60 text-sm font-light"
            animate={{ 
              opacity: isHovered ? 1 : 0.7,
              x: isHovered ? 4 : 0 
            }}
            transition={{ duration: 0.2 }}
          >
            Read article
            <ArrowUpRight className="h-3 w-3 ml-1" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Grid layout for Starlink-style cards
interface StarlinkGridProps {
  children: React.ReactNode[];
  className?: string;
}

export function StarlinkGrid({ children, className = "" }: StarlinkGridProps) {
  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}