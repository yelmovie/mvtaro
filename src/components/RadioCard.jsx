'use client';

export default function RadioCard({ id, label, checked, onChange }) {
  return (
    <label
      htmlFor={id}
      className={`
        block glass-card p-4 cursor-pointer
        transition-all duration-base
        min-h-[60px] flex items-center
        ${checked 
          ? 'border-2 border-primary bg-primary/5' 
          : 'border border-border hover:border-primary/50'
        }
      `}
    >
      <input
        type="radio"
        id={id}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div className="flex items-center gap-3 w-full">
        <div
          className={`
            w-5 h-5 rounded-full border-2 flex-shrink-0
            flex items-center justify-center
            transition-colors duration-fast
            ${checked ? 'border-primary' : 'border-muted'}
          `}
        >
          {checked && (
            <div className="w-3 h-3 rounded-full bg-primary"></div>
          )}
        </div>
        <span className="text-base">{label}</span>
      </div>
    </label>
  );
}
