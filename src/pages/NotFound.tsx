
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md text-center"
      >
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ 
            repeat: Infinity, 
            repeatType: "reverse", 
            duration: 2,
            ease: "easeInOut"
          }}
        >
          <h1 className="text-9xl font-bold text-edu-primary">404</h1>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-semibold mt-6 mb-2"
        >
          Không Tìm Thấy Trang
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-muted-foreground mb-8"
        >
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="default" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft size={16} />
            Quay Lại
          </Button>
          
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <Home size={16} />
              Trang Chủ
            </Button>
          </Link>
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-10 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Cần giúp đỡ? <a href="#" className="text-edu-primary underline hover:text-edu-secondary">Liên hệ hỗ trợ</a>
        </p>
      </motion.div>
    </div>
  );
};

export default NotFound;
