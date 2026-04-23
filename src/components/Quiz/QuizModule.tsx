import React, { useState } from 'react';
import { HelpCircle, Check, X, Trophy, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './QuizModule.css';

interface Question {
  id: number;
  statement: string;
  isFact: boolean;
  explanation: string;
}

const quizData: Question[] = [
  {
    id: 1,
    statement: "In India, you can vote using only your Aadhar Card, even if your name is not in the Electoral Roll.",
    isFact: false,
    explanation: "False. You MUST be registered in the Electoral Roll to vote. An identity card alone is not enough if your name is missing from the list."
  },
  {
    id: 2,
    statement: "EVMs (Electronic Voting Machines) in India are standalone machines and are not connected to the internet or any network.",
    isFact: true,
    explanation: "True. Indian EVMs are fully standalone, non-networked machines to prevent any remote hacking or tampering."
  },
  {
    id: 3,
    statement: "NOTA (None of the Above) counts as a valid vote that can lead to a re-election if it gets the highest number of votes.",
    isFact: false,
    explanation: "False. In India, even if NOTA gets the highest votes, the candidate with the second-highest votes is declared the winner."
  }
];

const QuizModule: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);

  const handleAnswer = (answer: boolean) => {
    setUserAnswer(answer);
    if (answer === quizData[currentStep].isFact) {
      setScore(score + 1);
    }
  };

  const nextStep = () => {
    if (currentStep < quizData.length - 1) {
      setCurrentStep(currentStep + 1);
      setUserAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setScore(0);
    setShowResult(false);
    setUserAnswer(null);
  };

  return (
    <section className="quiz-section container" id="quiz">
      <div className="quiz-card glass">
        {!showResult ? (
          <div className="quiz-content">
            <div className="quiz-header">
              <div className="quiz-title">
                <HelpCircle className="quiz-icon" />
                <h2>Election Myth-Buster (India)</h2>
              </div>
              <div className="quiz-progress">
                Question {currentStep + 1} of {quizData.length}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="question-container"
              >
                <p className="statement">"{quizData[currentStep].statement}"</p>

                <div className="quiz-options">
                  <button 
                    className={`opt-btn fact ${userAnswer === true ? 'selected' : ''}`}
                    onClick={() => { handleAnswer(true); }}
                    disabled={userAnswer !== null}
                  >
                    Fact
                  </button>
                  <button 
                    className={`opt-btn myth ${userAnswer === false ? 'selected' : ''}`}
                    onClick={() => { handleAnswer(false); }}
                    disabled={userAnswer !== null}
                  >
                    Myth
                  </button>
                </div>

                {userAnswer !== null && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`explanation-box ${userAnswer === quizData[currentStep].isFact ? 'correct' : 'wrong'}`}
                  >
                    <div className="exp-header">
                      {userAnswer === quizData[currentStep].isFact ? (
                        <><Check size={18} /> Sahi Jawab!</>
                      ) : (
                        <><X size={18} /> Try Again.</>
                      )}
                    </div>
                    <p>{quizData[currentStep].explanation}</p>
                    <button className="next-btn" onClick={nextStep}>
                      {currentStep < quizData.length - 1 ? 'Agla Sawal' : 'Results'} <ArrowRight size={16} />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="quiz-results"
          >
            <Trophy size={64} className="trophy-icon" />
            <h2>Bhartiya Voter Quiz Complete!</h2>
            <p className="final-score">You scored {score} out of {quizData.length}</p>
            <p className="result-msg">
              {score === quizData.length 
                ? "Excellent! You are a fully informed Indian citizen." 
                : "Good job! Keep learning to protect your democratic rights."}
            </p>
            <button className="reset-btn" onClick={resetQuiz}>Re-attempt</button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default QuizModule;
