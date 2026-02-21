import { useState } from 'react';
import { ArrowLeft, Heart, Calendar, Star, Brain, Users } from 'lucide-react';
import { MysticBackground } from '../MysticBackground';
import { motion } from 'motion/react';
import { calculateSaju, analyzePersonality, getCompatibilityInsight, SajuInfo, PersonalityType } from '../../utils/sajuAnalysis';

interface FeaturesScreenProps {
  userProfile: {
    birthDate: string;
    gender: string;
    name?: string;
    friendName?: string;
    personalityAnswers?: number[];
  };
  onBack: () => void;
}

export function FeaturesScreen({ userProfile, onBack }: FeaturesScreenProps) {
  const [activeTab, setActiveTab] = useState<'saju' | 'personality' | 'insight'>('saju');
  
  // Calculate Saju
  const sajuInfo: SajuInfo = calculateSaju(userProfile.birthDate);
  
  // Analyze Personality
  const personalityType: PersonalityType = userProfile.personalityAnswers 
    ? analyzePersonality(userProfile.personalityAnswers)
    : {
        type: '미완성',
        code: '????',
        description: '성격 테스트를 완료해주세요',
        strengths: [],
        friendshipStyle: '',
        compatibleTypes: []
      };

  const compatibilityInsight = getCompatibilityInsight(personalityType.type, userProfile.friendName);

  return (
    <div className="min-h-screen relative">
      <MysticBackground variant="moonlight-nature" intensity="medium" />

      <div className="relative z-10 py-8 px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button className="back-button mb-6" onClick={onBack}>
            <ArrowLeft size={20} />
            돌아가기
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div style={{
              fontSize: '2rem',
              marginBottom: '1rem',
              filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.5))'
            }}>
              ✦ 나의 분석 ✦
            </div>
            <h1 className="text-2xl font-semibold mb-2 text-primary">
              {userProfile.name || '친구'}님의 성격 & 사주 분석
            </h1>
            <p className="text-sm text-secondary">
              생년월일: {new Date(userProfile.birthDate).toLocaleDateString('ko-KR')}
            </p>
          </div>

          {/* Tab Buttons */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setActiveTab('saju')}
              className="glass-card transition-all"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: `2px solid ${activeTab === 'saju' ? 'var(--primary-purple)' : 'var(--surface-border)'}`,
                background: activeTab === 'saju' ? 'rgba(107, 70, 193, 0.3)' : 'var(--surface-glass)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9375rem'
              }}
            >
              <Star size={18} />
              사주 분석
            </button>
            <button
              onClick={() => setActiveTab('personality')}
              className="glass-card transition-all"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: `2px solid ${activeTab === 'personality' ? 'var(--primary-purple)' : 'var(--surface-border)'}`,
                background: activeTab === 'personality' ? 'rgba(107, 70, 193, 0.3)' : 'var(--surface-glass)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9375rem'
              }}
            >
              <Brain size={18} />
              성격 유형
            </button>
            <button
              onClick={() => setActiveTab('insight')}
              className="glass-card transition-all"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: `2px solid ${activeTab === 'insight' ? 'var(--primary-purple)' : 'var(--surface-border)'}`,
                background: activeTab === 'insight' ? 'rgba(107, 70, 193, 0.3)' : 'var(--surface-glass)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9375rem'
              }}
            >
              <Users size={18} />
              우정 통찰
            </button>
          </div>

          {/* Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'saju' && (
              <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <Star size={48} color="var(--primary-gold)" style={{ margin: '0 auto 1rem' }} />
                  <h2 className="text-xl font-semibold mb-2">
                    사주 기반 분석
                  </h2>
                  <p className="text-sm text-secondary">
                    생년월일을 기반으로 한 전통 사주 해석
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* 띠와 오행 */}
                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '1rem',
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1.5rem' }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>띠</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-gold)' }}>
                          {sajuInfo.yearAnimal}
                        </p>
                      </div>
                      <div style={{ width: '1px', background: 'var(--surface-border)' }} />
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>주 오행</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-gold)' }}>
                          {sajuInfo.dominantElement}
                        </p>
                      </div>
                    </div>

                    <div style={{
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '0.75rem'
                    }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>사주</p>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                        년주: {sajuInfo.year} | 월주: {sajuInfo.month} | 일주: {sajuInfo.day}
                      </p>
                    </div>
                  </div>

                  {/* 성격 특성 */}
                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(107, 70, 193, 0.1)',
                    borderRadius: '1rem',
                    border: '1px solid var(--primary-purple)'
                  }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      성격 특성
                    </h3>
                    <p style={{
                      fontSize: '1rem',
                      lineHeight: 1.8,
                      color: 'var(--text-secondary)'
                    }}>
                      {sajuInfo.personality}
                    </p>
                  </div>

                  {/* 우정 스타일 */}
                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(236, 72, 153, 0.1)',
                    borderRadius: '1rem',
                    border: '1px solid var(--primary-pink)'
                  }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Heart size={20} color="var(--primary-pink)" />
                      우정 스타일
                    </h3>
                    <p style={{
                      fontSize: '1rem',
                      lineHeight: 1.8,
                      color: 'var(--text-secondary)'
                    }}>
                      {sajuInfo.friendshipTrait}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'personality' && (
              <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <Brain size={48} color="var(--primary-purple)" style={{ margin: '0 auto 1rem' }} />
                  <h2 className="text-xl font-semibold mb-2">
                    성격 유형 분석
                  </h2>
                  <p className="text-sm text-secondary">
                    10가지 질문 기반 성격 유형 (MBTI 스타일)
                  </p>
                </div>

                {personalityType.code === '????' ? (
                  <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '1rem',
                    border: '1px dashed var(--surface-border)'
                  }}>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      성격 테스트를 아직 완료하지 않았습니다
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      프로필 설정에서 성격 테스트를 진행해주세요
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* 유형 타이틀 */}
                    <div style={{
                      padding: '2rem',
                      background: 'linear-gradient(135deg, rgba(107, 70, 193, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                      borderRadius: '1rem',
                      border: '1px solid var(--primary-purple)',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: 'var(--primary-gold)',
                        marginBottom: '0.5rem',
                        fontFamily: 'var(--font-display)'
                      }}>
                        {personalityType.code}
                      </div>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '1rem'
                      }}>
                        {personalityType.type}
                      </div>
                      <p style={{
                        fontSize: '1rem',
                        lineHeight: 1.7,
                        color: 'var(--text-secondary)'
                      }}>
                        {personalityType.description}
                      </p>
                    </div>

                    {/* 강점 */}
                    <div style={{
                      padding: '1.5rem',
                      background: 'rgba(245, 158, 11, 0.1)',
                      borderRadius: '1rem',
                      border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        주요 강점
                      </h3>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '0.75rem'
                      }}>
                        {personalityType.strengths.map((strength, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '0.75rem',
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '0.5rem',
                              textAlign: 'center',
                              fontSize: '0.9375rem',
                              fontWeight: 500,
                              color: 'var(--primary-gold)'
                            }}
                          >
                            {strength}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 우정 스타일 */}
                    <div style={{
                      padding: '1.5rem',
                      background: 'rgba(236, 72, 153, 0.1)',
                      borderRadius: '1rem',
                      border: '1px solid var(--primary-pink)'
                    }}>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Heart size={20} color="var(--primary-pink)" />
                        우정 스타일
                      </h3>
                      <p style={{
                        fontSize: '1rem',
                        lineHeight: 1.8,
                        color: 'var(--text-secondary)'
                      }}>
                        {personalityType.friendshipStyle}
                      </p>
                    </div>

                    {/* 잘 맞는 친구 유형 */}
                    <div style={{
                      padding: '1.5rem',
                      background: 'rgba(107, 70, 193, 0.1)',
                      borderRadius: '1rem',
                      border: '1px solid var(--primary-purple)'
                    }}>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Users size={20} color="var(--primary-purple)" />
                        잘 맞는 친구 유형
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.75rem'
                      }}>
                        {personalityType.compatibleTypes.map((type, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '0.625rem 1.125rem',
                              background: 'rgba(107, 70, 193, 0.2)',
                              border: '1px solid var(--primary-purple)',
                              borderRadius: '9999px',
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              color: 'var(--primary-purple)'
                            }}
                          >
                            {type}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'insight' && (
              <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <Users size={48} color="var(--primary-pink)" style={{ margin: '0 auto 1rem' }} />
                  <h2 className="text-xl font-semibold mb-2">
                    우정 통찰
                  </h2>
                  <p className="text-sm text-secondary">
                    사주와 성격 유형 기반 친구 관계 분석
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* 종합 인사이트 */}
                  <div style={{
                    padding: '2rem',
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(107, 70, 193, 0.15) 100%)',
                    borderRadius: '1rem',
                    border: '1px solid rgba(236, 72, 153, 0.3)'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      marginBottom: '1rem',
                      textAlign: 'center'
                    }}>
                      💫
                    </div>
                    <p style={{
                      fontSize: '1.125rem',
                      lineHeight: 1.8,
                      color: 'var(--text-primary)',
                      textAlign: 'center'
                    }}>
                      {compatibilityInsight}
                    </p>
                  </div>

                  {/* 사주 기반 우정 */}
                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '1rem',
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                  }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Star size={20} color="var(--primary-gold)" />
                      사주로 본 우정
                    </h3>
                    <p style={{
                      fontSize: '1rem',
                      lineHeight: 1.8,
                      color: 'var(--text-secondary)'
                    }}>
                      {sajuInfo.friendshipTrait}
                    </p>
                  </div>

                  {/* 성격 기반 우정 */}
                  {personalityType.code !== '????' && (
                    <div style={{
                      padding: '1.5rem',
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '1rem',
                      border: '1px solid #8B5CF6'
                    }}>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Brain size={20} color="#8B5CF6" />
                        성격으로 본 우정
                      </h3>
                      <p style={{
                        fontSize: '1rem',
                        lineHeight: 1.8,
                        color: 'var(--text-secondary)'
                      }}>
                        {personalityType.friendshipStyle}
                      </p>
                    </div>
                  )}

                  {/* 우정 조언 */}
                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '1rem',
                    border: '1px solid #10B981'
                  }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Heart size={20} color="#10B981" />
                      우정을 위한 조언
                    </h3>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                      <li style={{
                        fontSize: '0.9375rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'start',
                        gap: '0.5rem',
                        lineHeight: 1.7
                      }}>
                        <span style={{ color: '#10B981', flexShrink: 0 }}>•</span>
                        <span>서로의 차이를 인정하고 존중하는 태도가 중요합니다</span>
                      </li>
                      <li style={{
                        fontSize: '0.9375rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'start',
                        gap: '0.5rem',
                        lineHeight: 1.7
                      }}>
                        <span style={{ color: '#10B981', flexShrink: 0 }}>•</span>
                        <span>정기적인 소통으로 관계를 돈독히 하세요</span>
                      </li>
                      <li style={{
                        fontSize: '0.9375rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'start',
                        gap: '0.5rem',
                        lineHeight: 1.7
                      }}>
                        <span style={{ color: '#10B981', flexShrink: 0 }}>•</span>
                        <span>함께 새로운 경험을 하며 추억을 만들어가세요</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
