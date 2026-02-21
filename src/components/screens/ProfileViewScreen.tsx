import { ArrowLeft, User, Calendar, Heart, Star, TrendingUp } from 'lucide-react';
import { MysticBackground } from '../MysticBackground';
import { motion } from 'motion/react';

interface ProfileViewScreenProps {
  userProfile: {
    name?: string;
    friendName?: string;
    birthDate: string;
    gender: string;
    personalityAnswers?: number[];
  };
  onBack: () => void;
  onEditProfile: () => void;
}

export function ProfileViewScreen({ userProfile, onBack, onEditProfile }: ProfileViewScreenProps) {
  const getZodiacSign = (birthDate: string) => {
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '양자리 ♈';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '황소자리 ♉';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '쌍둥이자리 ♊';
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '게자리 ♋';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '사자자리 ♌';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '처녀자리 ♍';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return '천칭자리 ♎';
    if ((month === 10 && day >= 24) || (month === 11 && day <= 21)) return '전갈자리 ♏';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return '궁수자리 ♐';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '염소자리 ♑';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '물병자리 ♒';
    return '물고기자리 ♓';
  };

  const getGenderEmoji = (gender: string) => {
    if (gender === 'male') return '👦';
    if (gender === 'female') return '👧';
    return '⭐';
  };

  const zodiacSign = getZodiacSign(userProfile.birthDate);
  const age = new Date().getFullYear() - new Date(userProfile.birthDate).getFullYear();

  return (
    <div className="min-h-screen relative">
      <MysticBackground variant="tarot-space" intensity="medium" />

      <div className="relative z-10 py-8 px-4 pb-24">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button className="back-button mb-6" onClick={onBack}>
            <ArrowLeft size={20} />
            돌아가기
          </button>

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-card" style={{
              padding: '2.5rem',
              borderRadius: '1.5rem',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              {/* Avatar */}
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(107, 70, 193, 0.3) 0%, rgba(245, 158, 11, 0.3) 100%)',
                border: '3px solid var(--primary-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)'
              }}>
                {getGenderEmoji(userProfile.gender)}
              </div>

              {/* Name */}
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-display)'
              }}>
                {userProfile.name || '친구'}
              </h1>

              {/* Zodiac */}
              <p style={{
                fontSize: '1.125rem',
                color: 'var(--primary-gold)',
                marginBottom: '1rem',
                fontWeight: 500
              }}>
                {zodiacSign}
              </p>

              {/* Quick Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginTop: '2rem'
              }}>
                <div style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '0.75rem'
                }}>
                  <Calendar size={24} color="var(--primary-purple)" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>나이</p>
                  <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{age}세</p>
                </div>

                <div style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '0.75rem'
                }}>
                  <Star size={24} color="var(--primary-gold)" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>생일</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    {new Date(userProfile.birthDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                  </p>
                </div>

                <div style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '0.75rem'
                }}>
                  <Heart size={24} color="var(--primary-pink)" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>친구</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    {userProfile.friendName || '-'}
                  </p>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={onEditProfile}
                className="btn-primary"
                style={{
                  marginTop: '1.5rem',
                  width: '100%'
                }}
              >
                프로필 수정하기
              </button>
            </div>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              display: 'grid',
              gap: '1rem'
            }}
          >
            {/* Personality Status */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  성격 분석 상태
                </h3>
              </div>

              {userProfile.personalityAnswers && userProfile.personalityAnswers.length === 10 ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '2px solid #10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '1.25rem' }}>✓</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: '#10B981', marginBottom: '0.25rem' }}>
                      성격 테스트 완료
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      사주 & 성격 분석을 확인하실 수 있습니다
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(245, 158, 11, 0.2)',
                    border: '2px solid var(--primary-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '1.25rem' }}>!</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--primary-gold)', marginBottom: '0.25rem' }}>
                      성격 테스트 미완료
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      프로필을 수정하여 테스트를 완료하세요
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Account Info */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <User size={20} color="var(--primary-gold)" />
                계정 정보
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>가입일</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {new Date().toLocaleDateString('ko-KR')}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>타로 리딩 횟수</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {Math.floor(Math.random() * 20) + 1}회
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>데이터 저장</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    로컬 저장소
                  </span>
                </div>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="glass-card" style={{
              padding: '1.5rem',
              borderRadius: '1rem',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <TrendingUp size={32} color="var(--primary-gold)" style={{ margin: '0 auto 0.75rem' }} />
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: 'var(--primary-gold)',
                  marginBottom: '0.5rem'
                }}>
                  우정 탐험가
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6
                }}>
                  친구 관계를 소중히 여기고 더 나은 우정을 위해 노력하는 당신은 진정한 우정 탐험가입니다!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
