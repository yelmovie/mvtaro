import { X, Mail, MessageSquare, AlertCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useLanguage } from '../lib/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ContactType = 'suggestion' | 'bug' | null;

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { language } = useLanguage();
  const [selectedType, setSelectedType] = useState<ContactType>(null);
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const content = language === 'ko' ? {
    title: '개발자에게 문의',
    subtitle: '의견을 들려주세요',
    types: {
      suggestion: {
        title: '제안하기',
        description: '새로운 기능이나 개선 사항 제안',
        icon: MessageSquare,
        color: '#8B5CF6'
      },
      bug: {
        title: '오류 문의',
        description: '오류나 버그 신고',
        icon: AlertCircle,
        color: '#EF4444'
      }
    },
    emailPlaceholder: '답변받을 이메일 주소 (선택)',
    messagePlaceholder: '문의 내용을 자세히 작성해주세요...',
    sendButton: '전송하기',
    successTitle: '전송 완료!',
    successMessage: '개발자에게 메일이 전송되었습니다.\n연락 메일이나 연락처를 남겨주시면 빠른 시일 내에 답변드리겠습니다.',
    backButton: '돌아가기',
    closeButton: '닫기'
  } : {
    title: 'Contact Developer',
    subtitle: 'Share your feedback',
    types: {
      suggestion: {
        title: 'Suggestion',
        description: 'Suggest new features or improvements',
        icon: MessageSquare,
        color: '#8B5CF6'
      },
      bug: {
        title: 'Bug Report',
        description: 'Report errors or bugs',
        icon: AlertCircle,
        color: '#EF4444'
      }
    },
    emailPlaceholder: 'Your email for reply (optional)',
    messagePlaceholder: 'Please describe your inquiry in detail...',
    sendButton: 'Send',
    successTitle: 'Sent Successfully!',
    successMessage: 'Your message has been sent to the developer.\nIf you provided your contact information, we will respond as soon as possible.',
    backButton: 'Go Back',
    closeButton: 'Close'
  };

  const handleSubmit = () => {
    if (!selectedType || !message.trim()) return;

    // 실제 이메일 전송 로직 (mailto 사용)
    const typeText = content.types[selectedType].title;
    const subject = `[Arcana Compass] ${typeText}`;
    const body = `문의 유형: ${typeText}\n\n${message}\n\n---\n답변받을 이메일: ${userEmail || '없음'}`;
    const mailtoLink = `mailto:robell.comp@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;
    
    // 성공 상태로 전환
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setSelectedType(null);
    setMessage('');
    setUserEmail('');
    setIsSubmitted(false);
    onClose();
  };

  const handleBack = () => {
    if (isSubmitted) {
      handleClose();
    } else {
      setSelectedType(null);
      setMessage('');
      setUserEmail('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card modal-content"
          style={{
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '2rem',
            borderRadius: '1.5rem',
            position: 'relative'
          }}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '0.5rem',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <X size={18} color="var(--text-secondary)" />
          </button>

          {/* Success View */}
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-pink), var(--primary-purple))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}
              >
                <Mail size={40} color="white" />
              </motion.div>

              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                marginBottom: '1rem'
              }}>
                {content.successTitle}
              </h2>

              <p style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                fontSize: '1rem',
                whiteSpace: 'pre-line',
                marginBottom: '2rem'
              }}>
                {content.successMessage}
              </p>

              <button
                onClick={handleClose}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, var(--primary-pink), var(--primary-purple))',
                  border: 'none',
                  borderRadius: '0.75rem',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {content.closeButton}
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Mail size={40} color="var(--primary-gold)" style={{ margin: '0 auto 1rem' }} />
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  {content.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  {content.subtitle}
                </p>
              </div>

              {/* Type Selection or Message Form */}
              {!selectedType ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(Object.keys(content.types) as ContactType[]).filter(Boolean).map((type) => {
                    const typeContent = content.types[type!]!;
                    const Icon = typeContent.icon;
                    return (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className="glass-card"
                        style={{
                          padding: '1.5rem',
                          borderRadius: '1rem',
                          border: '1px solid var(--surface-border)',
                          background: 'rgba(255, 255, 255, 0.03)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '0.75rem',
                            background: typeContent.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Icon size={24} color="white" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h3 style={{
                              fontSize: '1.125rem',
                              fontWeight: '600',
                              color: 'var(--text-primary)',
                              marginBottom: '0.25rem'
                            }}>
                              {typeContent.title}
                            </h3>
                            <p style={{
                              fontSize: '0.875rem',
                              color: 'var(--text-secondary)'
                            }}>
                              {typeContent.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Selected Type Display */}
                  <div style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    {(() => {
                      const Icon = content.types[selectedType].icon;
                      return <Icon size={20} color={content.types[selectedType].color} />;
                    })()}
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                      {content.types[selectedType].title}
                    </span>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label style={{
                      display: 'block',
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem'
                    }}>
                      {content.emailPlaceholder}
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="your@email.com"
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--surface-border)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label style={{
                      display: 'block',
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem'
                    }}>
                      {content.messagePlaceholder}
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={content.messagePlaceholder}
                      rows={6}
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--surface-border)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        lineHeight: 1.6
                      }}
                    />
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={handleBack}
                      style={{
                        flex: 1,
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--surface-border)',
                        borderRadius: '0.75rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {content.backButton}
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!message.trim()}
                      style={{
                        flex: 2,
                        padding: '1rem',
                        background: message.trim() 
                          ? 'linear-gradient(135deg, var(--primary-pink), var(--primary-purple))'
                          : 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        borderRadius: '0.75rem',
                        color: 'white',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: message.trim() ? 'pointer' : 'not-allowed',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        opacity: message.trim() ? 1 : 0.5
                      }}
                    >
                      <Send size={18} />
                      {content.sendButton}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
