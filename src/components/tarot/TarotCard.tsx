interface TarotCardProps {
  symbol: string;
  name: string;
  number: number;
  isReversed?: boolean;
}

export function TarotCard({ symbol, name, number, isReversed = false }: TarotCardProps) {
  return (
    <div className="tarot-card-container">
      {/* Glass background */}
      <div className="tarot-card-glass" />
      
      {/* Border */}
      <div className="tarot-card-border" />
      
      {/* Content */}
      <div className={`tarot-card-content ${isReversed ? 'tarot-card-content-reversed' : ''}`}>
        {/* Card number */}
        <div className="tarot-card-number">
          {number}
        </div>
        
        {/* Symbol */}
        <div className="tarot-card-symbol-wrapper">
          {/* Glow effect */}
          <div className="tarot-card-symbol-glow" />
          <div className="tarot-card-symbol">{symbol}</div>
        </div>
        
        {/* Card name */}
        <h3 className="tarot-card-name">
          {name}
        </h3>
        
        {/* Reversed indicator */}
        {isReversed && (
          <div className="tarot-card-reversed">
            역방향
          </div>
        )}
      </div>
      
      {/* Decorative corners */}
      <div className="tarot-card-corner tarot-card-corner-tl" />
      <div className="tarot-card-corner tarot-card-corner-tr" />
      <div className="tarot-card-corner tarot-card-corner-bl" />
      <div className="tarot-card-corner tarot-card-corner-br" />
    </div>
  );
}
