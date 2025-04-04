
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Team = () => {
  const { isAuthenticated } = useAuth();
  
  const teamMembers = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      role: "Người Sáng Lập & CEO",
      bio: "Với hơn 10 năm kinh nghiệm trong lĩnh vực giáo dục trực tuyến, Nguyễn Văn An đã xây dựng EduSpark với tầm nhìn mang đến nền giáo dục chất lượng cho mọi người.",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      role: "Giám Đốc Học Thuật",
      bio: "Tiến sĩ Giáo dục từ Đại học Quốc gia, Trần Thị Bình giám sát toàn bộ nội dung giáo dục và đảm bảo chất lượng học tập trên nền tảng EduSpark.",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: 3,
      name: "Lê Minh Cường",
      role: "Trưởng phòng Công nghệ",
      bio: "Chuyên gia công nghệ với bề dày kinh nghiệm phát triển các nền tảng học tập trực tuyến quy mô lớn tại nhiều công ty công nghệ hàng đầu.",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: 4,
      name: "Phạm Hoài Dung",
      role: "Quản lý Trải nghiệm Người dùng",
      bio: "Với nền tảng về thiết kế UX/UI, Hoài Dung đảm bảo mọi học viên đều có trải nghiệm học tập tốt nhất trên nền tảng của chúng tôi.",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: 5,
      name: "Hoàng Đức Ân",
      role: "Giám đốc Phát triển Kinh doanh",
      bio: "Đức Ân xây dựng mối quan hệ đối tác chiến lược giúp EduSpark phát triển và mở rộng phạm vi tiếp cận đến nhiều học viên hơn.",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      id: 6,
      name: "Vũ Thanh Mai",
      role: "Trưởng bộ phận Hỗ trợ Học viên",
      bio: "Thanh Mai và đội ngũ của cô đảm bảo mọi học viên đều nhận được hỗ trợ kịp thời và hiệu quả trong suốt quá trình học tập.",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Banner Section with animation */}
        <motion.section 
          className="hero-gradient text-white py-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Đội Ngũ EduSpark
            </motion.h1>
            <motion.p 
              className="text-xl max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Gặp gỡ những người tài năng đằng sau nền tảng học tập hàng đầu của chúng tôi.
              Chúng tôi cam kết mang đến trải nghiệm giáo dục trực tuyến tốt nhất cho mọi học viên.
            </motion.p>
          </div>
        </motion.section>
        
        {/* Team Members Section with animation */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {teamMembers.map((member) => (
                <motion.div 
                  key={member.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden card-hover"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-64 object-cover object-center"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-edu-dark">{member.name}</h3>
                    <p className="text-edu-primary font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Join Us Section - Only visible when authenticated */}
        {isAuthenticated ? (
          <motion.section 
            className="py-16 bg-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-4 text-edu-dark">Tham Gia Cùng Chúng Tôi</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Chúng tôi luôn tìm kiếm những tài năng đam mê giáo dục và công nghệ.
                Nếu bạn muốn tạo ra sự khác biệt trong ngành giáo dục trực tuyến, hãy liên hệ với chúng tôi.
              </p>
              <motion.button 
                className="bg-edu-primary text-white px-6 py-3 rounded-md hover:bg-edu-primary/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Xem Vị Trí Đang Tuyển
              </motion.button>
            </div>
          </motion.section>
        ) : (
          <motion.section 
            className="py-16 bg-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-4 text-edu-dark">Khám Phá Nhiều Hơn</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Đăng ký tài khoản để tiếp cận đầy đủ các khóa học và tài nguyên giáo dục của chúng tôi.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.a 
                  href="/register" 
                  className="bg-edu-primary text-white px-6 py-3 rounded-md hover:bg-edu-primary/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Đăng Ký Ngay
                </motion.a>
                <motion.a 
                  href="/login" 
                  className="bg-white border border-edu-primary text-edu-primary px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Đăng Nhập
                </motion.a>
              </div>
            </div>
          </motion.section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Team;
