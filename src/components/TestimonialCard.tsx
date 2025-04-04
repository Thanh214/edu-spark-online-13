
import { motion } from "framer-motion";
import { QuoteIcon } from "lucide-react";

interface TestimonialCardProps {
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  index?: number;
}

const TestimonialCard = ({ content, author, index = 0 }: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <QuoteIcon className="h-8 w-8 text-edu-secondary/30 mb-4" />
      <p className="text-gray-700 italic mb-6">{content}</p>
      
      <div className="flex items-center">
        <img 
          src={author.avatar} 
          alt={author.name} 
          className="w-12 h-12 rounded-full object-cover border-2 border-edu-accent/30"
        />
        <div className="ml-3">
          <h4 className="font-medium text-gray-900">{author.name}</h4>
          <p className="text-sm text-gray-500">{author.role}</p>
        </div>
        <div className="ml-auto flex">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i} 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-yellow-400" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
