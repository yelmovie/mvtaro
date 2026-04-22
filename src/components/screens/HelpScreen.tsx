import { ArrowLeft, Heart, Star, BookOpen, Sparkles } from 'lucide-react';
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
    subtitle: '친구관계 마음코칭 카드를 사용하는 방법',
    sections: [
      {
        icon: Sparkles,
        title: '시작하는 순서',
        items: [
          '홈 화면에서 지금 가장 가까운 고민을 하나 고르세요',
          '내 감정과 마음 한 줄을 고르면 카드 뽑기 화면으로 이어집니다',
          '카드 3장은 내 마음, 친구의 입장, 내가 해볼 행동을 순서대로 보여줍니다',
          '결과를 읽으며 작은 행동 하나와 오늘 마음 한 줄을 정리해보세요'
        ]
      },
      {
        icon: Heart,
        title: '이 앱이 도와주는 것',
        items: [
          '내 감정을 먼저 알아차리도록 도와줍니다',
          '친구의 입장을 너무 무겁지 않게 상상해보게 합니다',
          '바로 해볼 수 있는 작은 행동을 제안합니다',
          '마지막에 내 마음을 한 문장으로 정리하게 돕습니다'
        ]
      },
      {
        icon: Star,
        title: '더 잘 활용하는 팁',
        items: [
          '조용한 곳에서 지금 가장 걸리는 마음을 먼저 떠올려보세요',
          '정답을 찾으려 하기보다 내 마음을 정리한다는 느낌으로 읽어보세요',
          '말하기 어렵다면 오늘은 작은 행동 하나만 골라도 충분합니다',
          '친구를 탓하기보다 내 마음을 부드럽게 표현하는 방향으로 읽어보세요'
        ]
      },
      {
        icon: BookOpen,
        title: '자주 묻는 질문',
        items: [
          'Q: 하루에 몇 번 해도 되나요?\nA: 필요할 때마다 다시 해보셔도 괜찮습니다.',
          'Q: 같은 고민으로 다시 해도 되나요?\nA: 네, 마음이 달라졌는지 다시 확인해볼 수 있습니다.',
          'Q: 카드가 미래를 맞혀주나요?\nA: 이 앱은 미래 예측보다 감정 정리와 관계 회복 방향에 초점을 둡니다.',
          'Q: 바로 말하기 어렵다면 어떻게 하나요?\nA: 오늘은 작은 행동이나 한 줄 정리만 해도 충분합니다.'
        ]
      }
    ]
  } : {
    title: 'Help Guide',
    subtitle: 'How to use the friendship coaching cards',
    sections: [
      {
        icon: Sparkles,
        title: 'Getting Started',
        items: [
          'Choose the friendship concern that feels closest to your current situation',
          'Select your emotion and the feeling sentence that matches you most',
          'The three cards guide you through your feelings, your friend’s perspective, and a possible action',
          'Use the final step to choose one small action and summarize your mind in one line'
        ]
      },
      {
        icon: Heart,
        title: 'What This App Helps With',
        items: [
          'Recognizing your own feelings first',
          'Thinking about your friend’s point of view gently',
          'Choosing one small action you can try today',
          'Finishing with a short self-reflection line'
        ]
      },
      {
        icon: Star,
        title: 'Helpful Tips',
        items: [
          'Start in a calm place and focus on the feeling that is bothering you most',
          'Read the cards as coaching hints, not as fixed answers',
          'If speaking feels hard, choosing one small action is enough for today',
          'Try to read the result as a gentle way to express your feelings'
        ]
      },
      {
        icon: BookOpen,
        title: 'FAQ',
        items: [
          'Q: How many times can I use it in one day?\nA: You can repeat it whenever you need to check your feelings again.',
          'Q: Can I revisit the same concern?\nA: Yes. It can help you see whether your feelings have changed.',
          'Q: Does it predict the future?\nA: No. It is designed as an educational coaching tool for feelings and relationships.',
          'Q: What if I am not ready to say anything today?\nA: It is okay to stop after choosing one small action or one summary line.'
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
          <p>✨ {language === 'ko' ? '천천히 읽고, 오늘 할 수 있는 한 걸음만 골라도 괜찮아요' : 'Take your time and choose just one small step for today'} ✨</p>
        </div>
      </div>
    </div>
  );
}
