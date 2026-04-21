import { useState } from 'react';
import { X, Calendar, User as UserIcon, Users, Heart, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  existingProfile?: UserProfile | null;
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
    question: "친구와 대화할 때 나는...",
    options: [
      { text: "먼저 말을 걸고 이야기를 주도해요", value: 1 },
      { text: "친구가 말을 걸면 적극적으로 응답해요", value: 0 }
    ]
  },
  {
    question: "친구와 약속을 잡을 때 나는...",
    options: [
      { text: "미리 계획을 세우고 준비해요", value: 1 },
      { text: "그때그때 상황에 맞춰 결정해요", value: 0 }
    ]
  },
  {
    question: "친구의 고민을 들을 때 나는...",
    options: [
      { text: "해결 방법을 찾아주려고 노력해요", value: 1 },
      { text: "공감하고 위로하는 것에 집중해요", value: 0 }
    ]
  },
  {
    question: "새로운 친구를 사귈 때 나는...",
    options: [
      { text: "먼저 다가가서 친해지려고 해요", value: 1 },
      { text: "천천히 시간을 두고 친해져요", value: 0 }
    ]
  },
  {
    question: "친구와 의견이 다를 때 나는...",
    options: [
      { text: "논리적으로 설명하며 설득해요", value: 1 },
      { text: "감정을 고려하며 조율하려고 해요", value: 0 }
    ]
  },
  {
    question: "친구 모임에서 나는...",
    options: [
      { text: "활발하게 이야기하고 분위기를 주도해요", value: 1 },
      { text: "조용히 듣고 필요할 때만 말해요", value: 0 }
    ]
  },
  {
    question: "친구와 갈등이 생기면 나는...",
    options: [
      { text: "바로 이야기하고 해결하려고 해요", value: 1 },
      { text: "시간을 두고 생각한 후 접근해요", value: 0 }
    ]
  },
  {
    question: "친구의 부탁을 받으면 나는...",
    options: [
      { text: "할 수 있는지 먼저 판단하고 대답해요", value: 1 },
      { text: "일단 도와주려고 노력해요", value: 0 }
    ]
  },
  {
    question: "친구 관계에서 중요한 것은...",
    options: [
      { text: "서로에 대한 믿음과 약속 지키기", value: 1 },
      { text: "감정적 교감과 이해", value: 0 }
    ]
  },
  {
    question: "친구와 함께 있을 때 나는...",
    options: [
      { text: "계속 활동하고 재미있는 일을 찾아요", value: 1 },
      { text: "편하게 대화하며 시간을 보내요", value: 0 }
    ]
  }
];

export function UserProfileModal({ isOpen, onClose, onSave, existingProfile }: UserProfileModalProps) {
  const [step, setStep] = useState<'basic' | 'personality'>(existingProfile ? 'basic' : 'basic');
  const [profile, setProfile] = useState<UserProfile>(existingProfile || {
    birthDate: '',
    gender: 'other',
    name: '',
    friendName: '',
    personalityAnswers: []
  });

  const handleBasicSubmit = () => {
    if (profile.birthDate) {
      if (!existingProfile) {
        // 새로운 프로필이면 성격 테스트로 이동
        setStep('personality');
      } else {
        // 기존 프로필 수정이면 바로 저장
        onSave(profile);
        onClose();
      }
    }
  };

  const handlePersonalityAnswer = (questionIndex: number, value: number) => {
    const newAnswers = [...(profile.personalityAnswers || [])];
    newAnswers[questionIndex] = value;
    setProfile({ ...profile, personalityAnswers: newAnswers });
  };

  const handleFinalSubmit = () => {
    onSave(profile);
    onClose();
  };

  const canProceedToPersonality = profile.birthDate && profile.name;
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
            style={{ maxWidth: '600px' }}
          >
            <button className="modal-close" onClick={onClose}>
              <X size={24} />
            </button>

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
                    더 정확한 타로 해석을 위해 정보를 입력해주세요
                  </p>
                  
                  {/* Benefits Badge */}
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.25rem',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '0.75rem',
                    display: 'inline-block'
                  }}>
                    <p style={{
                      fontSize: '0.8125rem',
                      color: 'var(--primary-gold)',
                      fontWeight: 500,
                      margin: 0
                    }}>
                      ✨ 프로필 입력 시 사주, MBTI 분석 기능이 추가로 제공됩니다!
                    </p>
                  </div>
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
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary-purple)';
                        e.target.style.background = 'rgba(107, 70, 193, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--surface-border)';
                        e.target.style.background = 'var(--surface-glass)';
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
                      친구 이름 (선택사항)
                    </label>
                    <input
                      id="friendName"
                      type="text"
                      value={profile.friendName}
                      onChange={(e) => setProfile({ ...profile, friendName: e.target.value })}
                      placeholder="타로를 볼 친구 이름을 입력하세요"
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
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary-pink)';
                        e.target.style.background = 'rgba(236, 72, 153, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--surface-border)';
                        e.target.style.background = 'var(--surface-glass)';
                      }}
                    />
                    <p style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      marginTop: '0.5rem',
                      fontStyle: 'italic'
                    }}>
                      💡 친구 이름을 입력하면 결과에 개인화된 메시지가 포함됩니다
                    </p>
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
                      생년월일 *
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
                        colorScheme: 'dark',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary-purple)';
                        e.target.style.background = 'rgba(107, 70, 193, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--surface-border)';
                        e.target.style.background = 'var(--surface-glass)';
                      }}
                    />
                    <p style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      marginTop: '0.5rem',
                      fontStyle: 'italic'
                    }}>
                      🔮 생년월일로 사주 기반 해석을 제공합니다
                    </p>
                  </div>

                  {/* Gender */}
                  <div>
                    <label style={{ 
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      marginBottom: '0.75rem',
                      color: 'var(--text-secondary)'
                    }}>
                      성별 *
                    </label>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {[
                        { value: 'male', label: '남성', emoji: '👦' },
                        { value: 'female', label: '여성', emoji: '👧' },
                        { value: 'other', label: '기타', emoji: '⭐' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setProfile({ ...profile, gender: option.value as any })}
                          className="glass-card"
                          style={{
                            flex: 1,
                            padding: '1rem 0.75rem',
                            borderRadius: '0.875rem',
                            border: `2px solid ${profile.gender === option.value ? 'var(--primary-purple)' : 'var(--surface-border)'}`,
                            background: profile.gender === option.value ? 'rgba(107, 70, 193, 0.2)' : 'var(--surface-glass)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.3s ease',
                            transform: profile.gender === option.value ? 'scale(1.05)' : 'scale(1)'
                          }}
                          onMouseEnter={(e) => {
                            if (profile.gender !== option.value) {
                              e.currentTarget.style.borderColor = 'rgba(107, 70, 193, 0.5)';
                              e.currentTarget.style.transform = 'scale(1.02)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (profile.gender !== option.value) {
                              e.currentTarget.style.borderColor = 'var(--surface-border)';
                              e.currentTarget.style.transform = 'scale(1)';
                            }
                          }}
                        >
                          <div style={{ fontSize: '1.75rem' }}>{option.emoji}</div>
                          <div style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: 500,
                            color: profile.gender === option.value ? 'var(--primary-purple)' : 'var(--text-primary)'
                          }}>
                            {option.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleBasicSubmit}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      marginTop: '0.5rem',
                      padding: '1rem',
                      fontSize: '1rem',
                      fontWeight: 600,
                      opacity: canProceedToPersonality ? 1 : 0.5,
                      cursor: canProceedToPersonality ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    disabled={!canProceedToPersonality}
                  >
                    {existingProfile ? '저장하기' : '다음 단계: 성격 테스트'}
                    {!existingProfile && <ChevronRight size={20} />}
                  </button>

                  {existingProfile && (
                    <button
                      type="button"
                      onClick={() => setStep('personality')}
                      className="btn-secondary"
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        fontSize: '0.9375rem',
                        fontWeight: 500
                      }}
                    >
                      성격 테스트 다시하기
                    </button>
                  )}
                </div>

                <p style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  marginTop: '1.5rem',
                  lineHeight: 1.6
                }}>
                  🔒 입력하신 정보는 타로 해석에만 사용되며<br />
                  안전하게 보호됩니다
                </p>
              </div>
            )}

            {step === 'personality' && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{
                    fontSize: '2rem',
                    marginBottom: '1rem',
                    filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.6))'
                  }}>
                    🧠
                  </div>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '0.75rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)'
                  }}>
                    성격 분석 테스트
                  </h2>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6
                  }}>
                    10가지 질문으로 당신의 성격 유형을 분석합니다
                  </p>
                  <div style={{
                    marginTop: '1rem',
                    fontSize: '0.875rem',
                    color: 'var(--primary-gold)',
                    fontWeight: 600
                  }}>
                    {profile.personalityAnswers?.length || 0} / {PERSONALITY_QUESTIONS.length} 완료
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  paddingRight: '0.5rem'
                }}>
                  {PERSONALITY_QUESTIONS.map((q, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '1.25rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '1rem',
                        border: '1px solid var(--surface-border)'
                      }}
                    >
                      <p style={{
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '1rem'
                      }}>
                        {index + 1}. {q.question}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {q.options.map((option, optIndex) => (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() => handlePersonalityAnswer(index, option.value)}
                            style={{
                              padding: '0.875rem 1rem',
                              background: profile.personalityAnswers?.[index] === option.value 
                                ? 'rgba(139, 92, 246, 0.2)' 
                                : 'var(--surface-glass)',
                              border: `2px solid ${profile.personalityAnswers?.[index] === option.value 
                                ? '#8B5CF6' 
                                : 'var(--surface-border)'}`,
                              borderRadius: '0.75rem',
                              color: 'var(--text-primary)',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => {
                              if (profile.personalityAnswers?.[index] !== option.value) {
                                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (profile.personalityAnswers?.[index] !== option.value) {
                                e.currentTarget.style.borderColor = 'var(--surface-border)';
                              }
                            }}
                          >
                            {option.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  marginTop: '1.5rem'
                }}>
                  <button
                    type="button"
                    onClick={() => setStep('basic')}
                    className="btn-secondary"
                    style={{
                      flex: 1,
                      padding: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <ChevronLeft size={20} />
                    이전
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="btn-primary"
                    style={{
                      flex: 2,
                      padding: '0.875rem',
                      opacity: allQuestionsAnswered ? 1 : 0.5,
                      cursor: allQuestionsAnswered ? 'pointer' : 'not-allowed'
                    }}
                    disabled={!allQuestionsAnswered}
                  >
                    {allQuestionsAnswered ? '완료하고 시작하기 ✨' : '모든 질문에 답해주세요'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
