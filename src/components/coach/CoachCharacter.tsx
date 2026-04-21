// @ts-ignore
import bearImg from '../../assets/bear.png';

interface CoachCharacterProps {
  emotion?: string;
  message: React.ReactNode;
}

export function CoachCharacter({ message }: CoachCharacterProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.5rem',
      padding: '1.5rem',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '20px',
      color: 'rgba(255,255,255,0.9)',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <div style={{
         width: '80px',
         height: '80px',
         background: 'rgba(255,255,255,0.1)',
         borderRadius: '50%',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         overflow: 'hidden',
         flexShrink: 0
      }}>
        <img 
          src={bearImg} 
          alt="마음 토닥 도우미" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 2.5rem;">🐻</span>';
          }}
        />
      </div>
      <div style={{ textAlign: 'left' }}>
        <strong style={{ display: 'block', fontSize: '1.125rem', marginBottom: '0.25rem', color: '#FCD34D' }}>💖 토닥 곰의 조언</strong>
        <span style={{ fontSize: '1rem', lineHeight: 1.6 }}>
          {message}
        </span>
      </div>
    </div>
  );
}
