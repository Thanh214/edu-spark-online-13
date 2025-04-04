
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  lessonsCount: number;
  enrolledCount: number;
  duration: string;
  category?: string;
  index?: number;
  compact?: boolean;
}

const CourseCard = ({
  id,
  title,
  description,
  thumbnail,
  instructor,
  lessonsCount,
  enrolledCount,
  duration,
  category,
  index = 0,
  compact = false
}: CourseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Thumbnail with category badge */}
        <div className="relative">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105" 
          />
          {category && (
            <span className="absolute top-3 right-3 bg-edu-primary text-white text-xs px-2 py-1 rounded">
              {category}
            </span>
          )}
        </div>
        
        <CardHeader className={compact ? "p-4" : "p-6"}>
          <CardTitle className={`${compact ? "text-lg" : "text-xl"} line-clamp-2`}>{title}</CardTitle>
          <CardDescription className="flex items-center text-sm mt-1">
            <img 
              src="https://randomuser.me/api/portraits/men/32.jpg" 
              alt={instructor} 
              className="w-5 h-5 rounded-full mr-2" 
            />
            {instructor}
          </CardDescription>
        </CardHeader>
        
        <CardContent className={compact ? "px-4 pt-0" : "px-6 pt-0"}>
          <p className="text-muted-foreground line-clamp-2 text-sm mb-4">{description}</p>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>{lessonsCount} bài học</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{enrolledCount}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className={compact ? "p-4 pt-4" : "p-6 pt-4"}>
          <Link to={`/courses/${id}`} className="w-full">
            <Button variant="default" size="sm" className="w-full">
              Chi tiết khóa học
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CourseCard;
