export default function InterpretationCard({ card }) {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <span className="text-4xl">{card.icon}</span>
        <div>
          <h3 className="text-xl font-bold">{card.name}</h3>
          <p className="text-sm text-muted">{card.subtitle}</p>
        </div>
      </div>

      <div>
        <p className="text-base leading-relaxed">{card.coreMessage}</p>
      </div>

      <div>
        <h4 className="text-sm font-bold text-muted mb-2">주목할 징후</h4>
        <ul className="space-y-2">
          {card.signs.map((sign, index) => (
            <li key={index} className="flex gap-2 text-sm">
              <span className="text-primary flex-shrink-0">•</span>
              <span>{sign}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-bold text-muted mb-2">앞으로의 선택</h4>
        <ul className="space-y-2">
          {card.paths.map((path, index) => (
            <li key={index} className="flex gap-2 text-sm">
              <span className="text-primary flex-shrink-0">{index + 1}.</span>
              <span>{path}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
