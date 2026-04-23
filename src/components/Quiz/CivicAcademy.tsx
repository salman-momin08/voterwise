import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Award,
  BookOpen,
  PlayCircle,
  Landmark
} from 'lucide-react';
import { ACADEMY_DATA, type LearningModule } from '../../data/academyData';
import './QuizModule.css';

type AcademyState = 'DASHBOARD' | 'LEARNING' | 'EXAM' | 'RESULTS';

const CivicAcademy: React.FC = () => {
  const [view, setView] = useState<AcademyState>('DASHBOARD');
  const [activeModule, setActiveModule] = useState<LearningModule | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [score, setScore] = useState(0);

  const calculateResults = React.useCallback(() => {
    if (!activeModule) return;
    let finalScore = 0;
    activeModule.quiz.forEach(q => {
      if (answers[q.id] === q.correctAnswer) finalScore++;
    });
    setScore(finalScore);
    setView('RESULTS');
  }, [activeModule, answers]);

  // Exam Timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (view === 'EXAM' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && view === 'EXAM') {
      calculateResults();
    }
    return () => { if (timer) clearInterval(timer); };
  }, [view, timeLeft, calculateResults]);

  const startModule = (module: LearningModule) => {
    setActiveModule(module);
    setView('LEARNING');
  };

  const startExam = () => {
    if (!activeModule) return;
    setCurrentQuestionIdx(0);
    setAnswers({});
    setTimeLeft(activeModule.quiz.length * 60); // 1 minute per question
    setView('EXAM');
  };

  const handleAnswer = (questionId: string, optionIdx: number) => {
    if (view !== 'EXAM') return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
    
    // Auto-advance or finish
    if (activeModule && currentQuestionIdx < activeModule.quiz.length - 1) {
      setTimeout(() => { setCurrentQuestionIdx(prev => prev + 1); }, 500);
    }
  };

  const reset = () => {
    setView('DASHBOARD');
    setActiveModule(null);
    setAnswers({});
  };

  const renderDashboard = () => (
    <div className="academy-dashboard animate-fade-in">
      <div className="wizard-header">
        <h2 className="section-title">Civic Academy</h2>
        <p className="section-subtitle">Master the democratic process through ECI-grounded literacy modules.</p>
      </div>

      <div className="module-grid">
        {ACADEMY_DATA.map((module) => (
          <div key={module.id} className="module-card glass" onClick={() => { startModule(module); }}>
            <div className="module-icon">
              <module.icon size={24} className="category-icon" />
              <PlayCircle className="start-icon" size={24} />
            </div>
            <div className="module-info">
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <div className="module-meta">
                <span><BookOpen size={14} /> {module.content.length} Sections</span>
                <span><Award size={14} /> Exam Ready</span>
              </div>
            </div>
            </div>
        ))}
      </div>
    </div>
  );

  const renderLearning = () => {
    if (!activeModule) return null;
    return (
      <div className="study-hall animate-fade-in">
        <div className="academy-nav">
          <button className="btn-secondary btn-sm" onClick={reset}>
            <ArrowLeft size={16} /> Back to Curriculum
          </button>
          <div className="learning-badge">
            <BookOpen size={14} /> Official ECI Guidelines
          </div>
        </div>

        <div className="study-content glass">
          <div className="study-header">
            <h2>{activeModule.title}</h2>
            <div className="section-count">{activeModule.content.length} High-Fidelity Sections</div>
          </div>

          <div className="learning-sections">
            {activeModule.content.map((sec, i) => (
              <div key={i} className="learning-sec">
                <h4>{sec.section}</h4>
                <p>{sec.text}</p>
              </div>
            ))}
          </div>

          {activeModule.resources && (
            <div className="resource-library glass">
              <h5><Landmark size={14} /> Official Reference Library</h5>
              <div className="resource-links">
                {activeModule.resources.map((res, i) => (
                  <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="res-link">
                    {res.label} <ArrowRight size={12} />
                  </a>
                ))}
              </div>
            </div>
          )}
          
          <div className="exam-prep">
            <div className="prep-info">
              <Award size={20} className="accent-icon" />
              <div>
                <strong>Ready for the Proficiency Exam?</strong>
                <p>Complete {activeModule.quiz.length} MCQs under timed conditions to earn your badge.</p>
              </div>
            </div>
            <button className="btn-primary" onClick={startExam}>
              Begin Proctored Exam <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  };


  const renderExam = () => {
    if (!activeModule) return null;
    const q = activeModule.quiz[currentQuestionIdx];
    const isAnswered = answers[q.id] !== undefined;

    return (
      <div className="exam-proctor animate-fade-in">
        <div className="exam-header glass">
          <div className="exam-timer">
            <Clock size={18} className={timeLeft < 30 ? 'text-error animate-pulse' : ''} />
            <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
          </div>
          <div className="exam-progress">
            Question {currentQuestionIdx + 1} / {activeModule.quiz.length}
          </div>
        </div>

        <div className="question-hall glass">
          <h3 className="exam-question">{q.text}</h3>
          <div className="options-grid">
            {q.options.map((opt, i) => (
              <button 
                key={i} 
                className={`option-btn ${answers[q.id] === i ? 'selected' : ''}`}
                onClick={() => { handleAnswer(q.id, i); }}
                disabled={isAnswered}
              >
                <div className="opt-letter">{String.fromCharCode(65 + i)}</div>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </div>

        {isAnswered && currentQuestionIdx === activeModule.quiz.length - 1 && (
          <button className="btn-primary finish-btn animate-bounce" onClick={calculateResults}>
            Submit Final Exam <Trophy size={18} />
          </button>
        )}
      </div>
    );
  };

  const renderResults = () => {
    if (!activeModule) return null;
    const percentage = (score / activeModule.quiz.length) * 100;
    const passed = percentage >= 70;

    return (
      <div className="exam-results glass animate-fade-in">
        <div className="results-hero">
          {passed ? (
            <div className="results-hero-status success horizontal">
              <Award size={32} className="hero-status-icon" />
              <h2>Proficiency Mastered!</h2>
            </div>
          ) : (
            <div className="results-hero-status fail horizontal">
              <XCircle size={32} className="hero-status-icon" />
              <h2>Needs Revision</h2>
            </div>
          )}
          <div className="score-display">
            <div className="score-circle">
              <span className="big-score">{score}</span>
              <span className="score-total">/ {activeModule.quiz.length}</span>
            </div>
            <p>Accuracy: {percentage}%</p>
          </div>
        </div>

        <div className="result-analysis">
          <h3>Exam Review</h3>
          <div className="review-list">
            {activeModule.quiz.map((q) => (
              <div key={q.id} className={`review-item ${answers[q.id] === q.correctAnswer ? 'correct' : 'wrong'}`}>
                <div className="review-header">
                  {answers[q.id] === q.correctAnswer ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  <span>{q.text}</span>
                </div>
                <p className="explanation">
                  <strong>Ground Truth:</strong> {q.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="results-actions">
          <button className="btn-secondary" onClick={reset}>Return to Academy</button>
          {!passed && <button className="btn-primary" onClick={startExam}>Re-attempt Exam</button>}
        </div>
      </div>
    );
  };

  return (
    <section className="academy-section container" id="quiz">
      <div className="academy-container">
        {view === 'DASHBOARD' && renderDashboard()}
        {view === 'LEARNING' && renderLearning()}
        {view === 'EXAM' && renderExam()}
        {view === 'RESULTS' && renderResults()}
      </div>
    </section>
  );
};

export default CivicAcademy;
