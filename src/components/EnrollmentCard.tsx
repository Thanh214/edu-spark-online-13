
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Users, Award, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface EnrollmentCardProps {
  courseId: string;
  price: number;
  discountPercentage?: number;
  enrolledCount: number;
  duration: string;
  certificate: boolean;
  level: string;
  isEnrolled?: boolean;
}

const EnrollmentCard = ({
  courseId,
  price,
  discountPercentage = 0,
  enrolledCount,
  duration,
  certificate,
  level,
  isEnrolled = false
}: EnrollmentCardProps) => {
  const [enrolling, setEnrolling] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const discountedPrice = discountPercentage > 0 
    ? price - (price * (discountPercentage / 100)) 
    : price;

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Chưa đăng nhập",
        description: "Vui lòng đăng nhập để đăng ký khóa học này",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    setEnrolling(true);
    
    // Simulate enrollment process
    setTimeout(() => {
      setEnrolling(false);
      toast({
        title: "Đăng ký thành công!",
        description: "Bạn đã đăng ký khóa học thành công",
        variant: "default"
      });
      // In a real application, you would redirect to the first lesson
      navigate(`/learning/${courseId}/lesson-1`);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border rounded-lg overflow-hidden bg-white shadow-md"
    >
      {/* Price section */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            {discountPercentage > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded mb-2 inline-block">
                Giảm {discountPercentage}%
              </span>
            )}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{discountedPrice.toLocaleString('vi-VN')}₫</span>
              {discountPercentage > 0 && (
                <span className="text-gray-500 line-through text-sm">
                  {price.toLocaleString('vi-VN')}₫
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Users className="h-4 w-4 mr-1" />
            <span>{enrolledCount} học viên</span>
          </div>
        </div>
      </div>

      {/* Course features */}
      <div className="p-6 border-b">
        <ul className="space-y-3">
          <li className="flex items-center">
            <Clock className="h-5 w-5 mr-3 text-edu-primary" />
            <span>Thời lượng: {duration}</span>
          </li>
          <li className="flex items-center">
            <Award className="h-5 w-5 mr-3 text-edu-primary" />
            <span>{certificate ? "Có chứng chỉ hoàn thành" : "Không có chứng chỉ"}</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-3 text-edu-primary" />
            <span>Cấp độ: {level}</span>
          </li>
        </ul>
      </div>

      {/* Action buttons */}
      <div className="p-6">
        {isEnrolled ? (
          <Button className="w-full mb-3" onClick={() => navigate(`/learning/${courseId}/lesson-1`)}>
            Tiếp tục học
          </Button>
        ) : (
          <Button 
            className="w-full mb-3" 
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? "Đang xử lý..." : "Đăng ký ngay"}
          </Button>
        )}
        
        {!isEnrolled && (
          <Button variant="outline" className="w-full">
            Thêm vào danh sách yêu thích
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default EnrollmentCard;
