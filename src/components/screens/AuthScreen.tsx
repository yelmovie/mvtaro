import { useState } from 'react';
import { MysticBackground } from '../MysticBackground';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowLeft, Check } from 'lucide-react';
import { supabase } from '../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface AuthScreenProps {
  onBack: () => void;
  onAuthSuccess: (session: any) => void;
}

export function AuthScreen({ onBack, onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [mbti, setMbti] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
      
      console.log('Google OAuth initiated:', data);
      // OAuth will redirect, so we don't need to do anything here
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('구글 로그인 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.');
      setEmail('');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || '비밀번호 재설정 요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
          }
          throw error;
        }
        
        if (data.session) {
          onAuthSuccess(data.session);
        }
      } else {
        // Validation for signup
        if (password.length < 6) {
          throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
        }

        if (password !== passwordConfirm) {
          throw new Error('비밀번호가 일치하지 않습니다.');
        }

        if (!agreePrivacy || !agreeTerms) {
          throw new Error('필수 약관에 모두 동의해주세요.');
        }

        // Sign up - need to use server endpoint
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
              password,
              name,
              birthDate,
              birthTime,
              mbti
            })
          }
        );

        const result = await response.json();

        if (!response.ok) {
          if (result.error?.includes('already been registered') || result.error?.includes('already registered')) {
            throw new Error('이미 가입된 이메일입니다. 로그인을 시도해주세요.');
          }
          throw new Error(result.error || '회원가입 중 오류가 발생했습니다.');
        }

        // After successful signup, automatically log in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        if (data.session) {
          onAuthSuccess(data.session);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || '인증 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password View
  if (showForgotPassword) {
    return (
      <div className="min-h-screen relative">
        <MysticBackground variant="tarot-space" intensity="medium" />

        <div className="relative z-10 py-8 px-4">
          <div className="max-w-md mx-auto">
            <button className="back-button mb-6" onClick={() => setShowForgotPassword(false)}>
              <ArrowLeft size={20} />
              돌아가기
            </button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.6))'
              }}>
                🔐
              </div>
              <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--primary-gold)' }}>
                비밀번호 찾기
              </h1>
              <p className="text-sm text-secondary">
                가입하신 이메일 주소를 입력해주세요
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card"
              style={{
                padding: '2rem',
                borderRadius: '1.5rem'
              }}
            >
              <form onSubmit={handleForgotPassword}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)'
                  }}>
                    이메일
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={18}
                      color="var(--text-muted)"
                      style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="example@email.com"
                      className="glass-card"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem 0.875rem 3rem',
                        fontSize: '1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--surface-border)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {error && (
                  <div style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '0.75rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#FCA5A5',
                    fontSize: '0.875rem',
                    lineHeight: 1.5
                  }}>
                    {error}
                  </div>
                )}

                {message && (
                  <div style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '0.75rem',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#86EFAC',
                    fontSize: '0.875rem',
                    lineHeight: 1.5
                  }}>
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="glass-card"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--primary-purple)',
                    background: 'rgba(107, 70, 193, 0.3)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: loading ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = 'rgba(107, 70, 193, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = 'rgba(107, 70, 193, 0.3)';
                    }
                  }}
                >
                  {loading ? '전송 중...' : '재설정 링크 전송'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <MysticBackground variant="tarot-space" intensity="medium" />

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <button className="back-button mb-6" onClick={onBack}>
            <ArrowLeft size={20} />
            돌아가기
          </button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.6))'
            }}>
              ✨
            </div>
            <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--primary-gold)' }}>
              {isLogin ? '로그인' : '회원가입'}
            </h1>
            <p className="text-sm text-secondary" style={{ 
              background: isLogin ? 'transparent' : 'linear-gradient(90deg, #8B5CF6, #F59E0B, #EC4899)',
              WebkitBackgroundClip: isLogin ? 'unset' : 'text',
              WebkitTextFillColor: isLogin ? 'inherit' : 'transparent',
              fontWeight: isLogin ? 'normal' : 600
            }}>
              {isLogin 
                ? '더 자세한 타로 해석을 받아보세요' 
                : '✨ 프로필 입력 시 사주, MBTI 분석 기반 추가 해석 제공! ✨'}
            </p>
          </motion.div>

          {/* Premium Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card mb-6"
            style={{
              padding: '1.5rem',
              borderRadius: '1rem',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--primary-gold)'
              }}>
                회원 전용 혜택
              </h3>
            </div>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {[
                '더 자세하고 깊이 있는 타로 해석',
                '사주와 MBTI 기반 개인 맞춤 분석',
                '리딩 히스토리 저장 및 관리',
                '카드별 상세한 조언과 실천 방법'
              ].map((benefit, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: '0.9375rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'start',
                    gap: '0.5rem',
                    lineHeight: 1.6
                  }}
                >
                  <span style={{ color: 'var(--primary-gold)', flexShrink: 0 }}>✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Auth Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
            style={{
              padding: '2rem',
              borderRadius: '1.5rem'
            }}
          >
            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="glass-card"
              style={{
                width: '100%',
                padding: '1rem',
                marginBottom: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--surface-border)',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                opacity: loading ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'var(--primary-purple)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'var(--surface-border)';
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19.8055 10.2292C19.8055 9.55146 19.7508 8.86668 19.6345 8.19586H10.2002V12.0489H15.6019C15.3773 13.2915 14.6571 14.3896 13.6025 15.0875V17.5863H16.826C18.7171 15.8449 19.8055 13.2724 19.8055 10.2292Z" fill="#4285F4"/>
                <path d="M10.2002 20.0006C12.9508 20.0006 15.2709 19.1151 16.826 17.5865L13.6025 15.0877C12.7025 15.6979 11.5508 16.0435 10.2002 16.0435C7.54647 16.0435 5.29083 14.2832 4.50083 11.9097H1.18896V14.4865C2.77271 17.6356 6.31083 20.0006 10.2002 20.0006Z" fill="#34A853"/>
                <path d="M4.50083 11.9097C4.06646 10.6671 4.06646 9.33368 4.50083 8.09107V5.51428H1.18896C-0.399793 8.66649 -0.399793 12.3336 1.18896 15.4858L4.50083 11.9097Z" fill="#FBBC04"/>
                <path d="M10.2002 3.95671C11.6281 3.93487 13.0054 4.47301 14.0327 5.45487L16.8908 2.60444C15.1827 0.991206 12.9356 0.0957031 10.2002 0.117537C6.31083 0.117537 2.77271 2.48258 1.18896 5.63165L4.50083 8.20844C5.29083 5.83487 7.54647 3.95671 10.2002 3.95671Z" fill="#EA4335"/>
              </svg>
              Google로 {isLogin ? '로그인' : '회원가입'}
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              margin: '1.5rem 0',
              color: 'var(--text-muted)',
              fontSize: '0.875rem'
            }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--surface-border)' }} />
              또는
              <div style={{ flex: 1, height: '1px', background: 'var(--surface-border)' }} />
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth}>
              {!isLogin && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)'
                    }}>
                      이름
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User
                        size={18}
                        color="var(--text-muted)"
                        style={{
                          position: 'absolute',
                          left: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}
                      />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isLogin}
                        placeholder="홍길동"
                        className="glass-card"
                        style={{
                          width: '100%',
                          padding: '0.875rem 1rem 0.875rem 3rem',
                          fontSize: '1rem',
                          borderRadius: '0.75rem',
                          border: '1px solid var(--surface-border)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--text-primary)',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)'
                    }}>
                      생년월일
                      <span style={{ 
                        marginLeft: '0.5rem', 
                        fontSize: '0.75rem', 
                        color: 'var(--primary-gold)',
                        fontWeight: 400
                      }}>
                        (더 정확한 해석을 위해 필요해요)
                      </span>
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required={!isLogin}
                      className="glass-card"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        fontSize: '1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--surface-border)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)'
                    }}>
                      출생시간
                      <span style={{ 
                        marginLeft: '0.5rem', 
                        fontSize: '0.75rem', 
                        color: 'var(--text-muted)',
                        fontWeight: 400
                      }}>
                        (선택사항, 더욱 정밀한 분석)
                      </span>
                    </label>
                    <input
                      type="time"
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="glass-card"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        fontSize: '1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--surface-border)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)'
                    }}>
                      MBTI
                      <span style={{ 
                        marginLeft: '0.5rem', 
                        fontSize: '0.75rem', 
                        color: 'var(--text-muted)',
                        fontWeight: 400
                      }}>
                        (선택사항, 성격 맞춤 조언)
                      </span>
                    </label>
                    <select
                      value={mbti}
                      onChange={(e) => setMbti(e.target.value)}
                      className="glass-card"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        fontSize: '1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--surface-border)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: mbti ? 'var(--text-primary)' : 'var(--text-muted)',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="" style={{ background: '#1a0b2e' }}>선택해주세요</option>
                      {['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP',
                        'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'].map(type => (
                        <option key={type} value={type} style={{ background: '#1a0b2e' }}>{type}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)'
                }}>
                  이메일
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={18}
                    color="var(--text-muted)"
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="example@email.com"
                    className="glass-card"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem 0.875rem 3rem',
                      fontSize: '1rem',
                      borderRadius: '0.75rem',
                      border: '1px solid var(--surface-border)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)'
                }}>
                  비밀번호
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={18}
                    color="var(--text-muted)"
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    minLength={6}
                    className="glass-card"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem 0.875rem 3rem',
                      fontSize: '1rem',
                      borderRadius: '0.75rem',
                      border: '1px solid var(--surface-border)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {!isLogin && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)'
                  }}>
                    비밀번호 확인
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={18}
                      color="var(--text-muted)"
                      style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    />
                    <input
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      required={!isLogin}
                      placeholder="••••••••"
                      minLength={6}
                      className="glass-card"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem 0.875rem 3rem',
                        fontSize: '1rem',
                        borderRadius: '0.75rem',
                        border: `1px solid ${passwordConfirm && password !== passwordConfirm ? 'rgba(239, 68, 68, 0.5)' : 'var(--surface-border)'}`,
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                    {passwordConfirm && password === passwordConfirm && (
                      <Check
                        size={18}
                        color="#22C55E"
                        style={{
                          position: 'absolute',
                          right: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}
                      />
                    )}
                  </div>
                  {passwordConfirm && password !== passwordConfirm && (
                    <p style={{
                      marginTop: '0.5rem',
                      fontSize: '0.75rem',
                      color: '#FCA5A5'
                    }}>
                      비밀번호가 일치하지 않습니다
                    </p>
                  )}
                </div>
              )}

              {/* Terms Agreement for Signup */}
              {!isLogin && (
                <div style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(139, 92, 246, 0.05)',
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                      style={{
                        marginTop: '0.125rem',
                        width: '1.125rem',
                        height: '1.125rem',
                        cursor: 'pointer',
                        accentColor: 'var(--primary-purple)'
                      }}
                    />
                    <span style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5
                    }}>
                      <strong style={{ color: 'var(--text-primary)' }}>[필수]</strong> 개인정보 수집 및 이용에 동의합니다
                      <br />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        (생년월일, MBTI 정보는 맞춤형 타로 해석 제공을 위해 사용됩니다)
                      </span>
                    </span>
                  </label>
                  
                  <label style={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: '0.75rem',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      style={{
                        marginTop: '0.125rem',
                        width: '1.125rem',
                        height: '1.125rem',
                        cursor: 'pointer',
                        accentColor: 'var(--primary-purple)'
                      }}
                    />
                    <span style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5
                    }}>
                      <strong style={{ color: 'var(--text-primary)' }}>[필수]</strong> 서비스 이용약관에 동의합니다
                      <br />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        (본 서비스는 오락용 콘텐츠이며, 실제 미래 예측이나 법적 책임을 지지 않습니다)
                      </span>
                    </span>
                  </label>
                </div>
              )}

              {/* Forgot Password Link */}
              {isLogin && (
                <div style={{
                  marginBottom: '1.5rem',
                  textAlign: 'right'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.875rem',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: 0
                    }}
                  >
                    비밀번호를 잊으셨나요?
                  </button>
                </div>
              )}

              {error && (
                <div style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#FCA5A5',
                  fontSize: '0.875rem',
                  lineHeight: 1.5
                }}>
                  {error}
                </div>
              )}

              {message && (
                <div style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#86EFAC',
                  fontSize: '0.875rem',
                  lineHeight: 1.5
                }}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (!isLogin && (!agreePrivacy || !agreeTerms))}
                className="glass-card"
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--primary-purple)',
                  background: 'rgba(107, 70, 193, 0.3)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: (loading || (!isLogin && (!agreePrivacy || !agreeTerms))) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: (loading || (!isLogin && (!agreePrivacy || !agreeTerms))) ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading && (isLogin || (agreePrivacy && agreeTerms))) {
                    e.currentTarget.style.background = 'rgba(107, 70, 193, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = 'rgba(107, 70, 193, 0.3)';
                  }
                }}
              >
                {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
              </button>
            </form>

            {/* Toggle Login/Signup */}
            <div style={{
              marginTop: '1.5rem',
              textAlign: 'center',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              {isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
              {' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setMessage(null);
                  setPasswordConfirm('');
                  setAgreePrivacy(false);
                  setAgreeTerms(false);
                }}
                style={{
                  color: 'var(--primary-purple)',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0
                }}
              >
                {isLogin ? '회원가입' : '로그인'}
              </button>
            </div>
          </motion.div>

          {/* Google Setup Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: '0.75rem',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6
            }}
          >
            💡 <strong>Google 로그인 사용 시:</strong> Google OAuth 제공자를 활성화해야 합니다.
            <br />
            자세한 설정은{' '}
            <a
              href="https://supabase.com/docs/guides/auth/social-login/auth-google"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--primary-purple)',
                textDecoration: 'underline'
              }}
            >
              여기
            </a>
            를 참고하세요.
          </motion.div>
        </div>
      </div>
    </div>
  );
}
