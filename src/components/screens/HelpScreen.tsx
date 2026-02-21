import { ArrowLeft, Heart, Star, BookOpen } from 'lucide-react';
import { MysticBackground } from '../MysticBackground';
import { motion } from 'motion/react';
import { useLanguage } from '../../lib/LanguageContext';

interface HelpScreenProps {
  onBack: () => void;
}

export function HelpScreen({ onBack }: HelpScreenProps) {
  const { language } = useLanguage();

  const content = language === 'ko' ? {
    title: '도움말',
    subtitle: '타로 여정을 시작하는 방법',
    sections: [
      {
        icon: Sparkles,
        title: '타로 리딩 시작하기',
        items: [
          '홈 화면에서 수정구슬을 클릭하거나 고민 카테고리를 선택하세요',
          '마음 속 질문을 떠올리며 카드를 선택하세요',
          '3장의 카드가 과거-현재-미래를 보여줍니다',
          '각 카드의 의미를 읽고 긍정적인 조언을 받으세요'
        ]
      },
      {
        icon: Heart,
        title: '프리미엄 회원 혜택',
        items: [
          '더욱 구체적이고 깊이 있는 타로 해석',
          '개인 맞춤형 조언 및 실용적인 가이드',
          '리딩 기록 저장 및 히스토리 확인',
          '광고 없는 깨끗한 경험'
        ]
      },
      {
        icon: Star,
        title: '타로 리딩 팁',
        items: [
          '조용하고 편안한 마음으로 시작하세요',
          '구체적인 질문을 떠올리면 더 명확한 답을 얻습니다',
          '타로는 긍정적인 방향을 제시하는 도구입니다',
          '열린 마음으로 메시지를 받아들이세요'
        ]
      },
      {
        icon: BookOpen,
        title: '자주 묻는 질문',
        items: [
          'Q: 하루에 몇 번 리딩할 수 있나요?\nA: 제한 없이 원하는 만큼 리딩하실 수 있습니다.',
          'Q: 같은 질문을 다시 물어봐도 되나요?\nA: 네, 시간이 지나면 상황이 변하므로 다시 물어보세요.',
          'Q: 타로 카드는 미래를 정확히 예측하나요?\nA: 타로는 현재 상황과 가능성을 보여주는 도구입니다.',
          'Q: 프리미엄은 어떻게 가입하나요?\nA: 설정 화면에서 프리미엄 구독을 선택하세요.'
        ]
      }
    ]
  } : {
    title: 'Help Guide',
    subtitle: 'How to start your tarot journey',
    sections: [
      {
        icon: Sparkles,
        title: 'Start Tarot Reading',
        items: [
          'Click the crystal ball or select a concern category on the home screen',
          'Choose cards while thinking of your question',
          '3 cards will show your past-present-future',
          'Read the meaning of each card and receive positive guidance'
        ]
      },
      {
        icon: Heart,
        title: 'Premium Member Benefits',
        items: [
          'More specific and in-depth tarot interpretations',
          'Personalized advice and practical guidance',
          'Save reading history and check past readings',
          'Ad-free clean experience'
        ]
      },
      {
        icon: Star,
        title: 'Tarot Reading Tips',
        items: [
          'Start with a quiet and comfortable mind',
          'Specific questions lead to clearer answers',
          'Tarot is a tool that suggests positive directions',
          'Accept messages with an open mind'
        ]
      },
      {
        icon: BookOpen,
        title: 'FAQ',
        items: [
          'Q: How many readings can I do per day?\nA: You can do unlimited readings.',
          'Q: Can I ask the same question again?\nA: Yes, situations change over time so feel free to ask again.',
          'Q: Do tarot cards predict the future accurately?\nA: Tarot shows current situations and possibilities.',
          'Q: How do I subscribe to Premium?\nA: Select Premium subscription in the settings screen.'
        ]
      }
    ]
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
            marginBottom: '3rem'
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
            fontSize: '1.1rem'
          }}>
            {content.subtitle}
          </p>
        </motion.div>

        {/* Content Sections */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
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
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '0.75rem',
                    background: 'linear-gradient(135deg, var(--primary-pink), var(--primary-purple))',
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
                
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
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
                        ✦
                      </span>
                      <span style={{
                        color: 'var(--text-secondary)',
                        lineHeight: 1.7,
                        fontSize: '1rem',
                        whiteSpace: 'pre-line'
                      }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem'
        }}>
          <p>✨ {language === 'ko' ? '타로의 신비로운 여정이 당신을 기다립니다' : 'A mystical tarot journey awaits you'} ✨</p>
        </div>
      </div>
    </div>
  );
}
