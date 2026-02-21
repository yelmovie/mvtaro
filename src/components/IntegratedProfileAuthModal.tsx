import { useState } from 'react';
import { X, Calendar, User as UserIcon, Heart, Mail, Lock, ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

interface IntegratedProfileAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile, session?: any) => void;
  existingProfile?: UserProfile | null;
  isLoggedIn?: boolean;
}

export interface UserProfile {
  birthDate: string;
  birthTime?: string;
  gender?: 'male' | 'female' | 'other';
  name?: string;
  friendName?: string;
  mbti?: string;
  personalityAnswers?: number[];
}

const PERSONALITY_QUESTIONS = [
  {
    question: "사람들과 대화할 때 나는...",
    options: [
      { text: "먼저 말을 걸고 이야기를 주도해요", value: 1, dimension: 'EI' },
      { text: "상대가 말을 걸면 적극적으로 응답해요", value: 0, dimension: 'EI' }
    ]
  },
  {
    question: "새로운 사람을 만날 때 나는...",
    options: [
      { text: "먼저 다가가서 친해지려고 해요", value: 1, dimension: 'EI' },
      { text: "천천히 시간을 두고 친해져요", value: 0, dimension: 'EI' }
    ]
  },
  {
    question: "사람들 모임에서 나는...",
    options: [
      { text: "활발하게 이야기하고 분위기를 주도해요", value: 1, dimension: 'EI' },
      { text: "조용히 듣고 필요할 때만 말해요", value: 0, dimension: 'EI' }
    ]
  },
  {
    question: "누군가와 약속을 잡을 때 나는...",
    options: [
      { text: "미리 계획을 세우고 준비해요", value: 1, dimension: 'JP' },
      { text: "그때그때 상황에 맞춰 결정해요", value: 0, dimension: 'JP' }
    ]
  },
  {
    question: "일을 처리할 때 나는...",
    options: [
      { text: "체계적으로 순서대로 진행해요", value: 1, dimension: 'JP' },
      { text: "유연하게 상황에 맞춰 진행해요", value: 0, dimension: 'JP' }
    ]
  },
  {
    question: "상대의 고민을 들을 때 나는...",
    options: [
      { text: "해결 방법을 찾아주려고 노력해요", value: 1, dimension: 'TF' },
      { text: "공감하고 위로하는 것에 집중해요", value: 0, dimension: 'TF' }
    ]
  },
  {
    question: "상대와 의견이 다를 때 나는...",
    options: [
      { text: "논리적으로 설명하며 설득해요", value: 1, dimension: 'TF' },
      { text: "감정을 고려하며 조율하려고 해요", value: 0, dimension: 'TF' }
    ]
  },
  {
    question: "관계에서 중요한 것은...",
    options: [
      { text: "서로에 대한 믿음과 약속 지키기", value: 1, dimension: 'TF' },
      { text: "감정적 교감과 이해", value: 0, dimension: 'TF' }
    ]
  },
  {
    question: "문제를 해결할 때 나는...",
    options: [
      { text: "현실적이고 검증된 방법을 선호해요", value: 0, dimension: 'SN' },
      { text: "새롭고 창의적인 방법을 시도해요", value: 1, dimension: 'SN' }
    ]
  },
  {
    question: "미래를 생각할 때 나는...",
    options: [
      { text: "구체적인 계획과 목표를 세워요", value: 0, dimension: 'SN' },
      { text: "큰 그림과 가능성을 상상해요", value: 1, dimension: 'SN' }
    ]
  }
];

const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

// Calculate MBTI from personality test answers
function calculateMBTI(answers: number[]): string {
  if (answers.length !== 10) return '';
  
  // EI: questions 0, 1, 2 (3 questions)
  const eiScore = answers[0] + answers[1] + answers[2];
  const ei = eiScore >= 2 ? 'E' : 'I';
  
  // SN: questions 8, 9 (2 questions) 
  const snScore = answers[8] + answers[9];
  const sn = snScore >= 1 ? 'N' : 'S';
  
  // TF: questions 5, 6, 7 (3 questions)
  const tfScore = answers[5] + answers[6] + answers[7];
  const tf = tfScore >= 2 ? 'T' : 'F';
  
  // JP: questions 3, 4 (2 questions)
  const jpScore = answers[3] + answers[4];
  const jp = jpScore >= 1 ? 'J' : 'P';
  
  return ei + sn + tf + jp;
}

export function IntegratedProfileAuthModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  existingProfile,
  isLoggedIn = false 
}: IntegratedProfileAuthModalProps) {
  const [step, setStep] = useState<'basic' | 'personality' | 'signup' | 'login'>(() => {
    if (existingProfile) return 'basic'; // 기존 프로필 수정
    if (isLoggedIn) return 'basic'; // 로그인 되어있으면 프로필만 입력
    return 'signup'; // 새 사용자는 회원가입부터 시작
  });

  const [profile, setProfile] = useState<UserProfile>(existingProfile || {
    birthDate: '',
    gender: 'other',
    name: '',
    friendName: '',
    mbti: '',
    personalityAnswers: []
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignupMode, setIsSignupMode] = useState(true);

  const handleBasicSubmit = () => {
    if (profile.birthDate && profile.name) {
      if (existingProfile) {
        // 기존 프로필 수정이면 바로 저장
        onSuccess(profile);
        onClose();
      } else {
        // 새로운 프로필이면 성격 테스트로 이동
        setStep('personality');
      }
    }
  };

  const handlePersonalityAnswer = (questionIndex: number, value: number) => {
    const newAnswers = [...(profile.personalityAnswers || [])];
    newAnswers[questionIndex] = value;
    setProfile({ ...profile, personalityAnswers: newAnswers });
  };

  const handlePersonalityComplete = async () => {
    // 성격 테스트 완료 후 MBTI 자동 계산
    const calculatedMBTI = calculateMBTI(profile.personalityAnswers || []);
    const updatedProfile = { ...profile, mbti: calculatedMBTI };
    
    setLoading(true);
    setError(null);

    try {
      // 현재 세션 가져오기
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('로그인이 필요합니다');
      }

      // 프로필 업데이트 API 호출
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-adbcd17e/profile/update`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            name: updatedProfile.name,
            birthDate: updatedProfile.birthDate,
            birthTime: updatedProfile.birthTime,
            mbti: updatedProfile.mbti,
            friendName: updatedProfile.friendName,
            personalityAnswers: updatedProfile.personalityAnswers
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '프로필 저장 중 오류가 발생했습니다');
      }

      // 성공시 프로필 저장 완료
      onSuccess(updatedProfile, session);
      onClose();
    } catch (err: any) {
      console.error('Profile save error:', err);
      setError(err.message || '프로필 저장 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
      
      // OAuth will redirect, so we don't need to do anything here
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(err.message || '구글 로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignupMode) {
        // 회원가입
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-adbcd17e/signup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({
              email,
              password
            })
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || '회원가입 중 오류가 발생했습니다.');
        }

        // 회원가입 후 자동 로그인
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        if (data.session) {
          // 회원가입 성공 후 프로필 입력 단계로 이동
          setStep('basic');
          setLoading(false);
          return;
        }
      } else {
        // 로그인
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        if (data.session) {
          onSuccess(profile, data.session);
          onClose();
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || '인증 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const canProceedFromBasic = profile.birthDate && profile.name;
  const allQuestionsAnswered = profile.personalityAnswers?.length === PERSONALITY_QUESTIONS.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <button className="modal-close" onClick={onClose}>
              <X size={24} />
            </button>

            {/* Step 1: 기본 프로필 입력 */}
            {step === 'basic' && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    marginBottom: '1rem',
                    filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.6))',
                    animation: 'float 3s ease-in-out infinite'
                  }}>
                    ✦
                  </div>
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 'bold',
                    marginBottom: '0.75rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)'
                  }}>
                    프로필 입력
                  </h2>
                  <p style={{
                    fontSize: '0.9375rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6
                  }}>
                    당신의 에너지를 카드와 연결하기 위해 필요해요
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Name */}
                  <div>
                    <label 
                      htmlFor="name" 
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        marginBottom: '0.75rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <UserIcon size={16} />
                      내 이름 *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="이름을 입력하세요"
                      required
                      className="glass-card"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1.125rem',
                        fontSize: '1rem',
                        borderRadius: '0.875rem',
                        border: '1px solid var(--surface-border)',
                        background: 'var(--surface-glass)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>

                  {/* Birth Date */}
                  <div>
                    <label 
                      htmlFor="birthDate" 
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        marginBottom: '0.75rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <Calendar size={16} />
                      생년월일 * <span style={{ fontSize: '0.75rem', color: 'var(--primary-gold)', marginLeft: '0.5rem' }}>(당신의 우주적 에너지)</span>
                    </label>
                    <input
                      id="birthDate"
                      type="date"
                      value={profile.birthDate}
                      onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                      required
                      className="glass-card"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1.125rem',
                        fontSize: '1rem',
                        borderRadius: '0.875rem',
                        border: '1px solid var(--surface-border)',
                        background: 'var(--surface-glass)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>

                  {/* Birth Time */}
                  <div>
                    <label 
                      htmlFor="birthTime" 
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        marginBottom: '0.75rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <Calendar size={16} />
                      출생시간 (선택사항)
                    </label>
                    <input
                      id="birthTime"
                      type="time"
                      value={profile.birthTime || ''}
                      onChange={(e) => setProfile({ ...profile, birthTime: e.target.value })}
                      className="glass-card"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1.125rem',
                        fontSize: '1rem',
                        borderRadius: '0.875rem',
                        border: '1px solid var(--surface-border)',
                        background: 'var(--surface-glass)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>

                  {/* Friend Name */}
                  <div>
                    <label 
                      htmlFor="friendName" 
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        marginBottom: '0.75rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <Heart size={16} />
                      상대방 이름 (선택사항)
                    </label>
                    <input
                      id="friendName"
                      type="text"
                      value={profile.friendName || ''}
                      onChange={(e) => setProfile({ ...profile, friendName: e.target.value })}
                      placeholder="타로를 볼 상대방의 이름"
                      className="glass-card"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1.125rem',
                        fontSize: '1rem',
                        borderRadius: '0.875rem',
                        border: '1px solid var(--surface-border)',
                        background: 'var(--surface-glass)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>

                  <button
                    onClick={handleBasicSubmit}
                    disabled={!canProceedFromBasic}
                    className="glass-card"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '1rem',
                      border: canProceedFromBasic ? '2px solid var(--primary-purple)' : '1px solid var(--surface-border)',
                      background: canProceedFromBasic ? 'rgba(107, 70, 193, 0.3)' : 'var(--surface-glass)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: canProceedFromBasic ? 'pointer' : 'not-allowed',
                      opacity: canProceedFromBasic ? 1 : 0.5,
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    다음 단계
                    <ChevronRight size={20} />
                  </button>

                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.6
                  }}>
                    <div style={{ marginBottom: '0.5rem', color: 'var(--primary-gold)', fontWeight: 600 }}>
                      📋 개인정보 처리 고지사항
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', listStyle: 'disc' }}>
                      <li>입력하신 모든 정보는 타로 해석의 정확도를 높이기 위한 <strong>선택사항</strong>입니다.</li>
                      <li>생년월일, 출생시간, 성격 테스트 결과는 AI 기반 맞춤형 타로 해석에만 활용됩니다.</li>
                      <li>본 서비스는 입력하신 개인정보에 대해 어떠한 법적 책임도 지지 않습니다.</li>
                      <li>개인정보는 안전하게 암호화되어 저장되며, 제3자에게 제공되지 않습니다.</li>
                    </ul>
                  </div>

                  {!isLoggedIn && !existingProfile && (
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                      <button
                        onClick={() => setStep('login')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary-gold)',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        이미 계정이 있으신가요? 로그인하기
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: 성격 테스트 */}
            {step === 'personality' && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <button
                    onClick={() => setStep('basic')}
                    style={{
                      position: 'absolute',
                      left: '1.5rem',
                      top: '1.5rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid var(--surface-border)',
                      borderRadius: '0.5rem',
                      padding: '0.5rem',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div style={{
                    fontSize: '2.5rem',
                    marginBottom: '1rem',
                    filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.6))'
                  }}>
                    🌟
                  </div>
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 'bold',
                    marginBottom: '0.75rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)'
                  }}>
                    성격 테스트
                  </h2>
                  <p style={{
                    fontSize: '0.9375rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6
                  }}>
                    대인관계에 대한 나의 성향을 알아보세요
                  </p>
                  <div style={{
                    marginTop: '0.75rem',
                    fontSize: '0.875rem',
                    color: 'var(--primary-gold)',
                    fontWeight: 500
                  }}>
                    {profile.personalityAnswers?.length || 0} / {PERSONALITY_QUESTIONS.length}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {PERSONALITY_QUESTIONS.map((q, index) => (
                    <div key={index} style={{
                      padding: '1.5rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '1rem',
                      border: '1px solid var(--surface-border)'
                    }}>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        marginBottom: '1rem',
                        color: 'var(--text-primary)'
                      }}>
                        Q{index + 1}. {q.question}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {q.options.map((option, optionIndex) => (
                          <button
                            key={optionIndex}
                            onClick={() => handlePersonalityAnswer(index, option.value)}
                            className="glass-card"
                            style={{
                              padding: '1rem',
                              borderRadius: '0.75rem',
                              border: profile.personalityAnswers?.[index] === option.value
                                ? '2px solid var(--primary-purple)'
                                : '1px solid var(--surface-border)',
                              background: profile.personalityAnswers?.[index] === option.value
                                ? 'rgba(107, 70, 193, 0.2)'
                                : 'var(--surface-glass)',
                              color: 'var(--text-primary)',
                              fontSize: '0.9375rem',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {option.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handlePersonalityComplete}
                    disabled={!allQuestionsAnswered}
                    className="glass-card"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '1rem',
                      border: allQuestionsAnswered ? '2px solid var(--primary-gold)' : '1px solid var(--surface-border)',
                      background: allQuestionsAnswered ? 'rgba(245, 158, 11, 0.3)' : 'var(--surface-glass)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: allQuestionsAnswered ? 'pointer' : 'not-allowed',
                      opacity: allQuestionsAnswered ? 1 : 0.5,
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {isLoggedIn ? '프로필 저장' : '완료하기'}
                    <ChevronRight size={20} />
                  </button>

                  {/* Privacy Notice */}
                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.6
                  }}>
                    <div style={{ marginBottom: '0.5rem', color: 'var(--primary-gold)', fontWeight: 600 }}>
                      📋 개인정보 처리 고지사항
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', listStyle: 'disc' }}>
                      <li>입력하신 성격 테스트 결과는 타로 해석의 정확도를 높이기 위한 <strong>선택사항</strong>입니다.</li>
                      <li>테스트 결과는 AI 기반 맞춤형 타로 해석에만 활용됩니다.</li>
                      <li>본 서비스는 테스트 결과에 대해 어떠한 법적 책임도 지지 않습니다.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: 회원가입/로그인 */}
            {(step === 'signup' || step === 'login') && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    marginBottom: '1rem',
                    filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.6))'
                  }}>
                    ✨
                  </div>
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 'bold',
                    marginBottom: '0.75rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)'
                  }}>
                    {step === 'signup' ? '회원가입' : '로그인'}
                  </h2>
                  <p style={{
                    fontSize: '0.9375rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6
                  }}>
                    {step === 'signup' 
                      ? '가입 후 프로필을 입력하여 맞춤형 타로 해석을 받으세요!' 
                      : '다시 만나서 반가워요!'}
                  </p>
                </div>

                {error && (
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '0.75rem',
                    color: '#ef4444',
                    fontSize: '0.875rem',
                    marginBottom: '1.5rem'
                  }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      marginBottom: '0.75rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <Mail size={16} />
                      이메일
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      required
                      className="glass-card"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1.125rem',
                        fontSize: '1rem',
                        borderRadius: '0.875rem',
                        border: '1px solid var(--surface-border)',
                        background: 'var(--surface-glass)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      marginBottom: '0.75rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <Lock size={16} />
                      비밀번호
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      required
                      className="glass-card"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1.125rem',
                        fontSize: '1rem',
                        borderRadius: '0.875rem',
                        border: '1px solid var(--surface-border)',
                        background: 'var(--surface-glass)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="glass-card"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '1rem',
                      border: '2px solid var(--primary-pink)',
                      background: 'rgba(236, 72, 153, 0.3)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.5 : 1,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? '처리 중...' : (step === 'signup' ? '회원가입 완료' : '로그인')}
                  </button>

                  <div style={{
                    position: 'relative',
                    textAlign: 'center',
                    margin: '0.5rem 0'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      right: 0,
                      height: '1px',
                      background: 'var(--surface-border)'
                    }} />
                    <span style={{
                      position: 'relative',
                      padding: '0 1rem',
                      background: 'var(--bg-dark)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem'
                    }}>
                      또는
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="glass-card"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '1rem',
                      border: '1px solid var(--surface-border)',
                      background: 'var(--surface-glass)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.5 : 1,
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google로 {step === 'signup' ? '가입' : '로그인'}
                  </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  {step === 'signup' ? (
                    <button
                      onClick={() => setStep('login')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-gold)',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      이미 계정이 있으신가요? 로그인하기
                    </button>
                  ) : (
                    <button
                      onClick={() => setStep('basic')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-gold)',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      계정이 없으신가요? 회원가입하기
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
