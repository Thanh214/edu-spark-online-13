
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { getExamById } from "@/utils/mockData";
import { Exam, Question } from "@/utils/mockData";
import { Clock, AlertCircle } from "lucide-react";

const ExamPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const { user } = useAuth();
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<number>(0);
  const [isPassed, setIsPassed] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExam = () => {
      if (!examId) return;
      
      const fetchedExam = getExamById(parseInt(examId));
      if (fetchedExam) {
        setExam(fetchedExam);
        setTimeLeft(fetchedExam.timeLimit * 60); // Convert minutes to seconds
      }
      
      setIsLoading(false);
    };
    
    fetchExam();
  }, [examId]);

  // Timer countdown
  useEffect(() => {
    if (!timeLeft || examSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, examSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    if (!exam || !exam.questions) return 0;
    
    let correctCount = 0;
    
    exam.questions.forEach(question => {
      const userAnswer = answers[question.questionId];
      if (userAnswer === question.correctAnswer) {
        correctCount++;
      }
    });
    
    return (correctCount / exam.questions.length) * 100;
  };

  const handleSubmit = () => {
    const score = calculateScore();
    setExamScore(score);
    setIsPassed(score >= (exam?.passingScore || 0));
    setExamSubmitted(true);
    
    // In a real app, we would submit the exam results to the server
    toast({
      title: "Exam Submitted",
      description: `Your score: ${score.toFixed(2)}%`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading exam...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Exam Not Found</h1>
            <p className="text-gray-600 mb-6">The exam you are looking for does not exist.</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If exam is submitted, show results
  if (examSubmitted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-edu-dark mb-2">Exam Results</h1>
                <p className="text-gray-600">{exam.title}</p>
              </div>
              
              <div className="mb-8">
                <div className={`p-6 rounded-lg ${
                  isPassed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center justify-center mb-4">
                    {isPassed ? (
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-center mb-2">
                    {isPassed ? 'Congratulations!' : 'Exam Not Passed'}
                  </h2>
                  
                  <p className="text-center mb-4">
                    {isPassed
                      ? `You've successfully passed the exam with a score of ${examScore.toFixed(2)}%.`
                      : `You've scored ${examScore.toFixed(2)}%. The required passing score is ${exam.passingScore}%.`}
                  </p>
                  
                  <div className="flex justify-center">
                    <Button onClick={() => navigate(-1)}>Return to Course</Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Exam Review</h3>
                
                {exam.questions?.map((question, index) => {
                  const userAnswer = answers[question.questionId];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={question.questionId} className="mb-6 p-4 border rounded-md">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{question.questionText}</p>
                        </div>
                      </div>
                      
                      <div className="ml-11 space-y-2">
                        <div className={`p-2 rounded ${
                          question.correctAnswer === 'A' ? 'bg-green-50' : ''
                        } ${
                          userAnswer === 'A' && !isCorrect ? 'bg-red-50' : ''
                        }`}>
                          <div className="flex items-center">
                            <span className="w-6 h-6 rounded-full border flex items-center justify-center mr-2">A</span>
                            {question.optionA}
                          </div>
                        </div>
                        
                        <div className={`p-2 rounded ${
                          question.correctAnswer === 'B' ? 'bg-green-50' : ''
                        } ${
                          userAnswer === 'B' && !isCorrect ? 'bg-red-50' : ''
                        }`}>
                          <div className="flex items-center">
                            <span className="w-6 h-6 rounded-full border flex items-center justify-center mr-2">B</span>
                            {question.optionB}
                          </div>
                        </div>
                        
                        <div className={`p-2 rounded ${
                          question.correctAnswer === 'C' ? 'bg-green-50' : ''
                        } ${
                          userAnswer === 'C' && !isCorrect ? 'bg-red-50' : ''
                        }`}>
                          <div className="flex items-center">
                            <span className="w-6 h-6 rounded-full border flex items-center justify-center mr-2">C</span>
                            {question.optionC}
                          </div>
                        </div>
                        
                        <div className={`p-2 rounded ${
                          question.correctAnswer === 'D' ? 'bg-green-50' : ''
                        } ${
                          userAnswer === 'D' && !isCorrect ? 'bg-red-50' : ''
                        }`}>
                          <div className="flex items-center">
                            <span className="w-6 h-6 rounded-full border flex items-center justify-center mr-2">D</span>
                            {question.optionD}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 ml-11 text-sm">
                        {isCorrect ? (
                          <div className="text-green-600">Your answer is correct!</div>
                        ) : (
                          <div className="text-red-600">
                            Your answer is incorrect. The correct answer is {question.correctAnswer}.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-edu-dark mb-2">{exam.title}</h1>
                <p className="text-gray-600">
                  Total Questions: {exam.totalQuestions} • Passing Score: {exam.passingScore}%
                </p>
              </div>
              
              <div className="flex items-center bg-edu-primary/10 text-edu-primary px-4 py-2 rounded-full">
                <Clock className="mr-2" size={18} />
                <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
              </div>
            </div>
            
            {/* Questions */}
            <div className="space-y-8 mb-8">
              {exam.questions?.map((question, index) => (
                <div key={question.questionId} className="p-6 border rounded-md">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-edu-accent/30 text-edu-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-medium">{question.questionText}</h3>
                  </div>
                  
                  <div className="ml-11">
                    <RadioGroup
                      value={answers[question.questionId] || ""}
                      onValueChange={(value) => handleAnswer(question.questionId, value)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="A" id={`q${question.questionId}-A`} />
                          <Label htmlFor={`q${question.questionId}-A`}>{question.optionA}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="B" id={`q${question.questionId}-B`} />
                          <Label htmlFor={`q${question.questionId}-B`}>{question.optionB}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="C" id={`q${question.questionId}-C`} />
                          <Label htmlFor={`q${question.questionId}-C`}>{question.optionC}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="D" id={`q${question.questionId}-D`} />
                          <Label htmlFor={`q${question.questionId}-D`}>{question.optionD}</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {Object.keys(answers).length} of {exam.questions?.length || 0} questions answered
              </div>
              
              <Button onClick={handleSubmit}>Submit Exam</Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ExamPage;
