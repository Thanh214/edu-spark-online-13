
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-edu-dark text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerChildren}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {/* Column 1 - About */}
          <motion.div variants={fadeIn}>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-edu-primary">Edu</span>
              <span className="text-edu-secondary">Spark</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Nền tảng học tập trực tuyến với sứ mệnh giúp mọi người tiếp cận với kiến thức chất lượng cao từ bất kỳ đâu.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </motion.div>
          
          {/* Column 2 - Quick Links */}
          <motion.div variants={fadeIn}>
            <h4 className="font-semibold mb-4 text-lg">Liên Kết Nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-flex transform duration-300">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-flex transform duration-300">
                  Khóa Học
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-flex transform duration-300">
                  Bảng Điều Khiển
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-flex transform duration-300">
                  Đội Ngũ
                </Link>
              </li>
            </ul>
          </motion.div>
          
          {/* Column 3 - Support */}
          <motion.div variants={fadeIn}>
            <h4 className="font-semibold mb-4 text-lg">Hỗ Trợ</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-flex transform duration-300">
                  Trung Tâm Trợ Giúp
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-flex transform duration-300">
                  Liên Hệ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-flex transform duration-300">
                  Điều Khoản Dịch Vụ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-flex transform duration-300">
                  Chính Sách Bảo Mật
                </a>
              </li>
            </ul>
          </motion.div>
          
          {/* Column 4 - Contact Info */}
          <motion.div variants={fadeIn}>
            <h4 className="font-semibold mb-4 text-lg">Thông Tin Liên Hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <MapPin size={18} className="text-edu-secondary" />
                <span className="text-gray-300">123 Đường ABC, Quận XYZ, TP.HCM</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-edu-secondary" />
                <a href="tel:+84123456789" className="text-gray-300 hover:text-white transition-colors">
                  (+84) 123 456 789
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-edu-secondary" />
                <a href="mailto:info@eduspark.com" className="text-gray-300 hover:text-white transition-colors">
                  info@eduspark.com
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Copyright section */}
      <div className="border-t border-gray-700 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {year} EduSpark. Tất cả các quyền được bảo lưu.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Chính sách bảo mật</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Điều khoản sử dụng</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
