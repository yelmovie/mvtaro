export function CardBack() {
  return (
    <div className="card-back-container">
      {/* Background with gradient */}
      <div className="card-back-gradient" />
      
      {/* Art Nouveau pattern overlay */}
      <div className="card-back-pattern">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="artNouveau" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M40 0 Q50 20 40 40 Q30 20 40 0 M0 40 Q20 50 40 40 Q20 30 0 40 M40 40 Q50 60 40 80 Q30 60 40 40 M40 40 Q60 50 80 40 Q60 30 40 40"
                className="card-back-pattern-path"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#artNouveau)" />
        </svg>
      </div>
      
      {/* Gold border */}
      <div className="card-back-border-outer" />
      <div className="card-back-border-inner" />
      
      {/* Center symbol */}
      <div className="card-back-center">
        <div className="card-back-symbol-container">
          {/* Glow effect */}
          <div className="card-back-symbol-glow" />
          
          {/* Symbol */}
          <div className="card-back-symbol">
            ✦
          </div>
        </div>
      </div>
      
      {/* Corner decorations */}
      <div className="card-back-corner card-back-corner-tl">✦</div>
      <div className="card-back-corner card-back-corner-tr">✦</div>
      <div className="card-back-corner card-back-corner-bl">✦</div>
      <div className="card-back-corner card-back-corner-br">✦</div>
    </div>
  );
}
