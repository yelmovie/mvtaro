import { X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: () => void;
}

export function MembershipModal({ isOpen, onClose, onSignup }: MembershipModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-content"
            style={{
              maxWidth: '500px',
              width: '100%',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              position: 'relative'
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                right: '1.5rem',
                top: '1.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <X size={24} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                animation: 'float 3s ease-in-out infinite'
              }}>
                ✨
              </div>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: 'var(--primary-gold)',
                fontFamily: 'var(--font-display)'
              }}>
                더 자세한 해석과 구체적인 조언을 받아보세요!
              </h2>
              <p style={{
                fontSize: '0.9375rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}>
                회원가입 후 더 깊이 있는 타로 예측과<br/>
                구체적인 행동 가이드를 받아보실 수 있습니다
              </p>
            </div>

            <div className="glass-card" style={{
              borderRadius: '1rem',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  {
                    icon: '🔮',
                    title: '더 구체적인 행동 가이드 제공',
                    desc: '회원님만을 위한 맞춤형 실천 조언'
                  },
                  {
                    icon: '💬',
                    title: '타로 리딩 히스토리 저장',
                    desc: '과거 해석을 언제든 다시 확인'
                  },
                  {
                    icon: '⚡',
                    title: '더 깊이 있는 해석',
                    desc: '상황에 딱 맞는 자세한 조언'
                  }
                ].map((benefit, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem'
                    }}
                  >
                    <div style={{
                      fontSize: '1.75rem',
                      flexShrink: 0,
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(245, 158, 11, 0.15)',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                      {benefit.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '0.25rem'
                      }}>
                        {benefit.title}
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)'
                      }}>
                        {benefit.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onSignup}
              style={{
                width: '100%',
                padding: '1.125rem',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(251, 191, 36, 0.9) 100%)',
                border: '2px solid rgba(245, 158, 11, 0.5)',
                borderRadius: '1rem',
                color: '#1E1B4B',
                fontSize: '1.125rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 30px rgba(245, 158, 11, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(245, 158, 11, 0.3)';
              }}
            >
              회원가입 / 로그인하기
            </button>

            <p style={{
              textAlign: 'center',
              marginTop: '1rem',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)'
            }}>
              이미 계정이 있으신가요? 로그인하여 혜택을 받으세요
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
