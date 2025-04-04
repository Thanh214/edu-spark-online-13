
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Team = () => {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Banner Section */}
        <section className="hero-gradient text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Đội Ngũ EduSpark</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Gặp gỡ những người tài năng đằng sau nền tảng học tập hàng đầu của chúng tôi.
              Chúng tôi cam kết mang đến trải nghiệm giáo dục trực tuyến tốt nhất cho mọi học viên.
            </p>
          </div>
        </section>
        
        {/* Team Members Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
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
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Join Us Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4 text-edu-dark">Tham Gia Cùng Chúng Tôi</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Chúng tôi luôn tìm kiếm những tài năng đam mê giáo dục và công nghệ.
              Nếu bạn muốn tạo ra sự khác biệt trong ngành giáo dục trực tuyến, hãy liên hệ với chúng tôi.
            </p>
            <button className="bg-edu-primary text-white px-6 py-3 rounded-md hover:bg-edu-primary/90 transition-colors">
              Xem Vị Trí Đang Tuyển
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Team;
