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
        description: '마음코칭 카드는 시연용 앱으로, 꼭 필요한 최소 정보만 다룹니다:',
        items: [
          '사용자가 선택한 고민, 감정, 마음 한 줄',
          '화면 표시를 위한 카드 결과 정보',
          '기기 안에 저장되는 테마, 보기 모드, 언어 설정',
          '문의하기에서 사용자가 직접 적은 이메일 주소와 문의 내용(메일 앱 사용 시)'
        ]
      },
      {
        icon: UserCheck,
        title: '정보 수집 방식',
        description: '앱은 사용자가 직접 선택하거나 입력한 정보만 사용합니다:',
        items: [
          '회원가입 없이 바로 사용할 수 있습니다',
          '학생 이름, 생년월일, 연락처를 필수로 받지 않습니다',
          '현재 시연 흐름의 결과 데이터는 주로 현재 화면에서만 사용됩니다',
          '설정 화면에서 앱 저장 정보를 직접 지울 수 있습니다'
        ]
      },
      {
        icon: Eye,
        title: '정보 사용 목적',
        description: '선택된 정보는 다음 목적에서만 사용됩니다:',
        items: [
          '감정 인식, 관계 이해, 행동 선택 결과를 보여주기 위해',
          '사용자가 이전과 비슷한 화면 환경으로 앱을 다시 보기 위해',
          '문의 메일을 보낼 때 제목과 내용을 메일 앱으로 넘기기 위해',
          '시연 안정성과 사용성 확인을 위해'
        ]
      },
      {
        icon: Lock,
        title: '정보 보호',
        description: '민감한 정보를 최소화하고, 브라우저 저장 범위를 줄이는 방향으로 설계했습니다:',
        items: [
          '학생 개인정보를 필수로 저장하지 않습니다',
          '설정 정보는 사용자 기기의 브라우저 저장소에만 남습니다',
          '외부로 자동 전송되는 개인정보 수집 기능은 기본 흐름에 포함하지 않았습니다',
          '불필요한 개발 로그와 레거시 문구는 제출 전 정리합니다'
        ]
      },
      {
        icon: AlertCircle,
        title: '책임의 제한',
        description: '앱 이용 시 아래 내용을 함께 확인해 주세요:',
        items: [
          '이 앱은 친구관계 마음을 정리해보는 교육용 코칭 도구입니다',
          '의학적, 법적, 전문 상담을 대신하지 않습니다',
          '문의하기에 적는 내용은 사용자가 직접 확인한 뒤 메일 앱으로 전송됩니다',
          '시연용 환경에서는 네트워크나 기기 상태에 따라 일부 화면이 달라질 수 있습니다'
        ]
      },
      {
        icon: Shield,
        title: '귀하의 권리',
        description: '앱 사용자는 다음과 같은 선택 권한을 가집니다:',
        items: [
          '설정과 저장 정보를 언제든지 지울 수 있습니다',
          '문의 메일 전송 전 내용을 직접 확인하고 취소할 수 있습니다',
          '개인정보를 적지 않고도 대부분의 시연 기능을 사용할 수 있습니다',
          '궁금한 점은 아래 메일로 문의할 수 있습니다'
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
    subtitle: 'Safe and transparent information handling',
    lastUpdated: 'Last Updated: February 21, 2026',
    sections: [
      {
        icon: Database,
        title: 'Information We Collect',
        description: 'Mind Coaching Card uses only the minimum information needed for the demo flow:',
        items: [
          'Selected concern, emotion, and feeling sentence',
          'Card result data shown on the current screen',
          'Theme, language, and view mode saved in the browser',
          'Email address and message only when the user chooses to send a contact email'
        ]
      },
      {
        icon: UserCheck,
        title: 'How We Collect Information',
        description: 'The app uses only information the user directly selects or enters:',
        items: [
          'No account is required to use the main coaching flow',
          'Student name, birth date, and phone number are not required',
          'Most result data is used only during the current session',
          'Saved app data can be removed from the settings screen'
        ]
      },
      {
        icon: Eye,
        title: 'Purpose of Use',
        description: 'Selected information is used only for these purposes:',
        items: [
          'Show emotion understanding, relationship guidance, and action suggestions',
          'Restore the user’s preferred theme, language, and view mode',
          'Pass contact message details to the user’s mail app when requested',
          'Support demo stability and usability checks'
        ]
      },
      {
        icon: Lock,
        title: 'Information Protection',
        description: 'The app is designed to minimize sensitive data and limit browser storage:',
        items: [
          'Student personal information is not required for the main demo',
          'Saved settings stay in the local browser storage',
          'The main flow does not automatically send personal data to external services',
          'Debug logs and legacy strings are cleaned up before submission'
        ]
      },
      {
        icon: AlertCircle,
        title: 'Limitation of Liability',
        description: 'Please note the following when using the app:',
        items: [
          'This app is an educational coaching tool for organizing friendship-related feelings',
          'It does not replace medical, legal, or professional counseling',
          'Contact messages are reviewed by the user before opening the mail app',
          'Some visual behavior may vary depending on device or browser conditions'
        ]
      },
      {
        icon: Shield,
        title: 'Your Rights',
        description: 'Users have the following choices:',
        items: [
          'You can remove saved app data at any time',
          'You can review or cancel a contact email before sending it',
          'You can use most demo features without entering personal information',
          'You can contact us with questions using the email below'
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
          <p>🍀 {language === 'ko' ? '안심하고 사용할 수 있는 친구관계 마음코칭 경험을 지향합니다' : 'We aim to provide a safe and reassuring friendship coaching experience'} 🍀</p>
        </div>
      </div>
    </div>
  );
}
