import { ArrowLeft, Shield, Lock, Eye, UserCheck, Database, AlertCircle } from 'lucide-react';
import { MysticBackground } from '../MysticBackground';
import { motion } from 'motion/react';
import { useLanguage } from '../../lib/LanguageContext';

interface PrivacyScreenProps {
  onBack: () => void;
}

export function PrivacyScreen({ onBack }: PrivacyScreenProps) {
  const { language } = useLanguage();

  const content = language === 'ko' ? {
    title: '개인정보 처리방침',
    subtitle: '안전하고 투명한 정보 관리',
    lastUpdated: '최종 업데이트: 2026년 2월 21일',
    sections: [
      {
        icon: Database,
        title: '수집하는 정보',
        description: 'Arcana Compass는 더 깊이 있는 타로 해석을 제공하기 위해 다음 정보를 수집합니다:',
        items: [
          '생년월일 (선택사항)',
          '성격 테스트 결과 (선택사항)',
          '타로 리딩 질문 및 선택한 카드',
          '프리미엄 회원의 경우 리딩 히스토리'
        ]
      },
      {
        icon: UserCheck,
        title: '정보 수집 방식',
        description: '모든 개인정보는 사용자의 명시적 동의와 선택에 의해서만 수집됩니다:',
        items: [
          '회원가입 시 선택적으로 제공',
          '프로필 설정에서 직접 입력',
          '언제든지 정보 수정 및 삭제 가능',
          '비회원은 기본 타로 리딩만 이용 가능'
        ]
      },
      {
        icon: Eye,
        title: '정보 사용 목적',
        description: '수집된 정보는 오직 다음 목적으로만 사용됩니다:',
        items: [
          '개인 맞춤형 타로 해석 생성',
          'AI 기반 더 깊이 있는 조언 제공',
          '프리미엄 회원의 리딩 히스토리 저장',
          '서비스 개선 및 사용자 경험 향상'
        ]
      },
      {
        icon: Lock,
        title: '정보 보호',
        description: '귀하의 개인정보는 안전하게 보호됩니다:',
        items: [
          '암호화된 데이터베이스에 안전하게 저장',
          '제3자에게 판매하거나 공유하지 않음',
          '법적 요구가 있는 경우를 제외하고 외부 제공 없음',
          '정기적인 보안 점검 및 업데이트'
        ]
      },
      {
        icon: AlertCircle,
        title: '책임의 제한',
        description: '서비스 이용 시 다음 사항을 숙지해 주시기 바랍니다:',
        items: [
          '타로는 엔터테인먼트 목적의 도구이며 의학적/법적 조언을 대체할 수 없습니다',
          '사용자가 선택적으로 제공한 정보에 대한 책임은 사용자 본인에게 있습니다',
          '불가항력적 사이버 공격으로 인한 정보 유출에 대해서는 책임을 지지 않습니다',
          '서비스는 "있는 그대로" 제공되며, 특정 목적에 대한 적합성을 보증하지 않습니다'
        ]
      },
      {
        icon: Shield,
        title: '귀하의 권리',
        description: '개인정보와 관련하여 다음 권리를 가집니다:',
        items: [
          '언제든지 본인의 정보를 열람할 권리',
          '정보의 수정 및 업데이트 요청 권리',
          '정보의 삭제 및 회원 탈퇴 권리',
          '정보 처리 중단 요청 권리'
        ]
      }
    ],
    contact: {
      title: '문의하기',
      description: '개인정보 처리방침에 대한 질문이 있으시면 언제든지 문의해 주세요:',
      email: 'robell.comp@gmail.com'
    }
  } : {
    title: 'Privacy Policy',
    subtitle: 'Safe and transparent information management',
    lastUpdated: 'Last Updated: February 21, 2026',
    sections: [
      {
        icon: Database,
        title: 'Information We Collect',
        description: 'Arcana Compass collects the following information to provide deeper tarot interpretations:',
        items: [
          'Date of birth (optional)',
          'Personality test results (optional)',
          'Tarot reading questions and selected cards',
          'Reading history for premium members'
        ]
      },
      {
        icon: UserCheck,
        title: 'How We Collect Information',
        description: 'All personal information is collected only with explicit user consent and choice:',
        items: [
          'Optionally provided during registration',
          'Directly entered in profile settings',
          'Can be modified or deleted at any time',
          'Non-members can only use basic tarot readings'
        ]
      },
      {
        icon: Eye,
        title: 'Purpose of Use',
        description: 'Collected information is used only for the following purposes:',
        items: [
          'Generate personalized tarot interpretations',
          'Provide AI-based deeper advice',
          'Save reading history for premium members',
          'Improve service and user experience'
        ]
      },
      {
        icon: Lock,
        title: 'Information Protection',
        description: 'Your personal information is securely protected:',
        items: [
          'Safely stored in encrypted databases',
          'Not sold or shared with third parties',
          'No external provision except for legal requirements',
          'Regular security checks and updates'
        ]
      },
      {
        icon: AlertCircle,
        title: 'Limitation of Liability',
        description: 'Please be aware of the following when using the service:',
        items: [
          'Tarot is an entertainment tool and cannot replace medical/legal advice',
          'Users are responsible for information they choose to provide',
          'We are not liable for information leaks due to force majeure cyber attacks',
          'Service is provided "as is" without warranty of fitness for any particular purpose'
        ]
      },
      {
        icon: Shield,
        title: 'Your Rights',
        description: 'You have the following rights regarding your personal information:',
        items: [
          'Right to view your information at any time',
          'Right to request correction and updates',
          'Right to delete information and withdraw membership',
          'Right to request suspension of information processing'
        ]
      }
    ],
    contact: {
      title: 'Contact Us',
      description: 'If you have any questions about our privacy policy, please contact us:',
      email: 'robell.comp@gmail.com'
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--surface-gradient)',
      position: 'relative',
      overflow: 'auto'
    }}>
      <MysticBackground />
      
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '900px',
        margin: '0 auto',
        padding: '1.5rem'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <button
            onClick={onBack}
            className="glass-card"
            style={{
              padding: '0.625rem',
              borderRadius: '0.75rem',
              border: '1px solid var(--surface-border)',
              background: 'var(--surface-glass)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowLeft size={20} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            marginBottom: '1rem'
          }}
        >
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, var(--primary-pink) 0%, var(--primary-purple) 50%, var(--primary-blue) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            {content.title}
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            marginBottom: '0.5rem'
          }}>
            {content.subtitle}
          </p>
          <p style={{
            color: 'var(--primary-gold)',
            fontSize: '0.9rem'
          }}>
            {content.lastUpdated}
          </p>
        </motion.div>

        {/* Content Sections */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          marginTop: '3rem'
        }}>
          {content.sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card"
                style={{
                  padding: '2rem',
                  borderRadius: '1.5rem',
                  border: '1px solid var(--surface-border)',
                  background: 'var(--surface-glass)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '0.75rem',
                    background: 'linear-gradient(135deg, var(--primary-purple), var(--primary-blue))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={22} color="white" />
                  </div>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)'
                  }}>
                    {section.title}
                  </h2>
                </div>
                
                <p style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '1.25rem'
                }}>
                  {section.description}
                </p>

                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  {section.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      style={{
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-start'
                      }}
                    >
                      <span style={{
                        color: 'var(--primary-gold)',
                        fontSize: '1.25rem',
                        marginTop: '0.1rem',
                        flexShrink: 0
                      }}>
                        •
                      </span>
                      <span style={{
                        color: 'var(--text-secondary)',
                        lineHeight: 1.7,
                        fontSize: '0.95rem'
                      }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: content.sections.length * 0.1 }}
            className="glass-card"
            style={{
              padding: '2rem',
              borderRadius: '1.5rem',
              border: '2px solid var(--primary-gold)',
              background: 'rgba(245, 158, 11, 0.1)',
              textAlign: 'center'
            }}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--primary-gold)',
              marginBottom: '1rem'
            }}>
              {content.contact.title}
            </h2>
            <p style={{
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '1rem'
            }}>
              {content.contact.description}
            </p>
            <a
              href={`mailto:${content.contact.email}`}
              style={{
                color: 'var(--primary-pink)',
                fontSize: '1.1rem',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              {content.contact.email}
            </a>
          </motion.div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem'
        }}>
          <p>🔮 {language === 'ko' ? '안전하고 신뢰할 수 있는 타로 경험을 제공합니다' : 'We provide a safe and trustworthy tarot experience'} 🔮</p>
        </div>
      </div>
    </div>
  );
}
