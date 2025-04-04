
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-brand-blue to-brand-indigo bg-clip-text text-transparent">EduSpark</h3>
            <p className="text-gray-300 mb-4">
              Nền tảng học trực tuyến chất lượng cao với nhiều khóa học đa dạng, giúp bạn phát triển kỹ năng và đạt mục tiêu nghề nghiệp.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="mailto:contact@eduspark.com" className="text-gray-300 hover:text-white">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Khám phá</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-white">Khóa học</Link>
              </li>
              <li>
                <Link to="/teachers" className="text-gray-300 hover:text-white">Giảng viên</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white">Blog</Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-white">Sự kiện</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Thông tin</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">Về chúng tôi</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">Liên hệ</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white">Điều khoản sử dụng</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <address className="text-gray-300 not-italic">
              <p className="mb-2">123 Đường Giáo Dục, Quận 1</p>
              <p className="mb-2">TP. Hồ Chí Minh, Việt Nam</p>
              <p className="mb-2">Email: support@eduspark.com</p>
              <p>Hotline: 1900 1234 56</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} EduSpark Online Learning. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
