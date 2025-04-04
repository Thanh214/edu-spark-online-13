
import { Clock, BookOpen, User, Award, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CourseDetailHeroProps {
  title: string;
  instructor: string;
  description: string;
  thumbnail: string;
  lessonsCount: number;
  duration: string;
  level: string;
  category: string;
  isEnrolled?: boolean;
  courseId: string;
}

const CourseDetailHero = ({
  title,
  instructor,
  description,
  thumbnail,
  lessonsCount,
  duration,
  level,
  category,
  isEnrolled = false,
  courseId
}: CourseDetailHeroProps) => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-12 lg:py-20 bg-gradient-to-r from-edu-primary/90 to-edu-secondary/90 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:30px_30px] opacity-20"></div>
      
      {/* Animated circles */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-1/4 w-56 h-56 bg-white/5 rounded-full blur-xl"></div>
      </motion.div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left column - Course details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <div className="mb-4">
              <span className="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full">
                {category}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{title}</h1>
            <p className="mb-6 text-white/90 text-lg">{description}</p>
            
            <div className="flex items-center mb-6">
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt={instructor}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
              />
              <div className="ml-3">
                <p className="text-sm opacity-90">Giảng viên</p>
                <p className="font-semibold">{instructor}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                <span>{lessonsCount} bài học</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>{level}</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                <span>Có chứng chỉ</span>
              </div>
            </div>
            
            {isEnrolled ? (
              <Button 
                size="lg" 
                className="bg-white text-edu-primary hover:bg-white/90"
                onClick={() => navigate(`/learning/${courseId}/lesson-1`)}
              >
                <PlayIcon className="mr-2 h-5 w-5" /> Tiếp tục học
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="bg-white text-edu-primary hover:bg-white/90"
                onClick={() => document.getElementById('enrollment-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Đăng ký ngay
              </Button>
            )}
          </motion.div>
          
          {/* Right column - Course thumbnail */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white/20 aspect-video">
              <img 
                src={thumbnail} 
                alt={title} 
                className="w-full h-full object-cover"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group hover:bg-black/40 transition-all duration-300 cursor-pointer">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <PlayIcon className="h-8 w-8 text-edu-primary" />
                </div>
              </div>
              
              {/* Course features pill */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-lg py-3 px-4">
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center text-white">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Học mọi lúc, mọi nơi</span>
                  </div>
                  <div className="flex items-center text-white">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Truy cập trọn đời</span>
                  </div>
                  <div className="flex items-center text-white">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Hỗ trợ 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// PlayIcon component
const PlayIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export default CourseDetailHero;
