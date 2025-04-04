
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { mockCourses } from "@/utils/mockData";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Sparkles, Users, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  // Featured courses - showing the first 3
  const featuredCourses = mockCourses.slice(0, 3);
  const hasFeaturedCourses = featuredCourses.length > 0;

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section with animated elements */}
        <section className="hero-gradient text-white py-20 md:py-28 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-edu-primary to-edu-secondary opacity-90"></div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 overflow-hidden"
          >
            <div className="absolute top-20 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
          </motion.div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Thay Đổi Tương Lai Của Bạn Cùng <span className="relative inline-block">
                EduSpark
                <span className="absolute -top-1 -right-4">
                  <motion.div
                    initial={{ rotate: -20, scale: 0.5 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <Sparkles className="text-yellow-300 h-6 w-6" />
                  </motion.div>
                </span>
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            >
              Khám phá tiềm năng của bạn với các khóa học trực tuyến do chuyên gia hướng dẫn. 
              Học theo tốc độ của riêng bạn và đạt được mục tiêu của mình.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6, duration: 0.7 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link to={isAuthenticated ? "/courses" : "/login"}>
                <Button size="lg" className="bg-white text-edu-primary hover:bg-gray-100 transition-all duration-300 hover:shadow-lg group">
                  Khám Phá Khóa Học
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-edu-primary transition-all duration-300">
                  {isAuthenticated ? "Bảng Điều Khiển" : "Tham Gia Miễn Phí"}
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1, duration: 0.7 }}
              className="mt-12 flex flex-wrap justify-center gap-6 text-white"
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>10,000+ Học Viên</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>100+ Khóa Học</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span>Chứng Chỉ Công Nhận</span>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Featured Courses with animation */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-2 text-edu-dark">Khóa Học Nổi Bật</h2>
              <p className="text-lg text-gray-600">Khám phá các lộ trình học tập phổ biến nhất của chúng tôi</p>
            </motion.div>
            
            {hasFeaturedCourses ? (
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {featuredCourses.map((course) => (
                  <motion.div 
                    key={course.courseId} 
                    variants={fadeIn}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 bg-edu-primary text-white text-xs font-bold px-2 py-1 rounded">
                        {course.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-edu-dark">{course.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {course.lessonsCount} bài học • {course.enrolledCount} học viên
                        </div>
                        <Link to={isAuthenticated ? `/courses/${course.courseId}` : "/login"}>
                          <Button size="sm" className="group">
                            Xem Khóa Học
                            <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                variants={fadeIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-center py-12 bg-white rounded-lg shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-edu-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-xl font-semibold mb-2 text-edu-dark">Chưa có khóa học nào</h3>
                <p className="text-gray-600 mb-6">Các khóa học đang được phát triển. Vui lòng quay lại sau.</p>
                <Link to="/register">
                  <Button>Đăng Ký Nhận Thông Báo</Button>
                </Link>
              </motion.div>
            )}
            
            {hasFeaturedCourses && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-center mt-12"
              >
                <Link to="/courses">
                  <Button variant="outline" size="lg" className="group">
                    Xem Tất Cả Khóa Học
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </section>
        
        {/* Why Choose Us section with animated icons */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-2 text-edu-dark">Tại Sao Chọn EduSpark</h2>
              <p className="text-lg text-gray-600">Những lợi ích khiến nền tảng của chúng tôi khác biệt</p>
            </motion.div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <motion.div 
                variants={fadeIn}
                className="text-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300"
              >
                <motion.div 
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    delay: 0.1,
                    duration: 0.6 
                  }}
                  className="bg-edu-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <BookOpen className="h-8 w-8 text-edu-primary" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-edu-dark">Giảng Viên Chuyên Nghiệp</h3>
                <p className="text-gray-600">Học từ các chuyên gia hàng đầu với nhiều năm kinh nghiệm thực tế.</p>
              </motion.div>
              
              <motion.div 
                variants={fadeIn}
                className="text-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300"
              >
                <motion.div 
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    delay: 0.2,
                    duration: 0.6 
                  }}
                  className="bg-edu-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-edu-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-edu-dark">Học Tập Linh Hoạt</h3>
                <p className="text-gray-600">Học theo tốc độ của riêng bạn với quyền truy cập trọn đời vào tài liệu khóa học.</p>
              </motion.div>
              
              <motion.div 
                variants={fadeIn}
                className="text-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300"
              >
                <motion.div 
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    delay: 0.3,
                    duration: 0.6 
                  }}
                  className="bg-edu-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Award className="h-8 w-8 text-edu-primary" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-edu-dark">Chứng Chỉ Được Công Nhận</h3>
                <p className="text-gray-600">Nhận chứng chỉ được công nhận sau khi hoàn thành khóa học thành công.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* New testimonials section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-2 text-edu-dark">Học Viên Nói Gì Về Chúng Tôi</h2>
              <p className="text-lg text-gray-600">Phản hồi từ những người đã học tập cùng EduSpark</p>
            </motion.div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                {
                  name: "Nguyễn Văn A",
                  role: "Sinh viên",
                  image: "https://randomuser.me/api/portraits/men/32.jpg",
                  content: "EduSpark đã giúp tôi hoàn thành mục tiêu học tập của mình với sự linh hoạt tuyệt vời. Các giảng viên rất chuyên nghiệp và nhiệt tình.",
                },
                {
                  name: "Trần Thị B",
                  role: "Nhân viên văn phòng",
                  image: "https://randomuser.me/api/portraits/women/44.jpg",
                  content: "Tôi có thể học mọi lúc mọi nơi nhờ nền tảng EduSpark. Chất lượng khóa học vượt xa mong đợi của tôi.",
                },
                {
                  name: "Lê Văn C",
                  role: "Kỹ sư phần mềm",
                  image: "https://randomuser.me/api/portraits/men/67.jpg",
                  content: "Kiến thức tôi học được từ các khóa học đã giúp tôi thăng tiến trong sự nghiệp. Cảm ơn EduSpark rất nhiều!",
                }
              ].map((testimonial, index) => (
                <motion.div 
                  key={index}
                  variants={fadeIn}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-edu-dark">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                  <div className="mt-3 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Call to action section */}
        <section className="py-16 bg-gradient-to-r from-edu-primary to-edu-secondary text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4">Sẵn Sàng Để Bắt Đầu Hành Trình Học Tập?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">Tham gia cùng hàng nghìn học viên đang phát triển kỹ năng và kiến thức của họ với EduSpark.</p>
              <Link to={isAuthenticated ? "/courses" : "/register"}>
                <Button size="lg" className="bg-white text-edu-primary hover:bg-gray-100 transition-all duration-300 hover:shadow-lg">
                  Bắt Đầu Ngay Hôm Nay
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
