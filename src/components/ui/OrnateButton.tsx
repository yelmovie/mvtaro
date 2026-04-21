import { ButtonHTMLAttributes } from 'react';

interface OrnateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function OrnateButton({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}: OrnateButtonProps) {
  return (
    <button
      className={`ornate-button ${variant} ${className}`}
      {...props}
    >
      <div className="ornate-button-frame">
        <svg className="ornate-button-corner top-left" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0,100 Q 0,0 100,0" fill="currentColor" />
          <path d="M 10,100 Q 10,10 100,10" fill="rgba(0,0,0,0.3)" />
        </svg>
        <svg className="ornate-button-corner top-right" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0,0 Q 100,0 100,100" fill="currentColor" />
          <path d="M 0,10 Q 90,10 90,100" fill="rgba(0,0,0,0.3)" />
        </svg>
        <svg className="ornate-button-corner bottom-left" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0,0 Q 0,100 100,100" fill="currentColor" />
          <path d="M 10,0 Q 10,90 100,90" fill="rgba(0,0,0,0.3)" />
        </svg>
        <svg className="ornate-button-corner bottom-right" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 100,0 Q 100,100 0,100" fill="currentColor" />
          <path d="M 90,0 Q 90,90 0,90" fill="rgba(0,0,0,0.3)" />
        </svg>
        
        <div className="ornate-button-top-ornament">✦</div>
        <div className="ornate-button-bottom-ornament">✦</div>
      </div>
      
      <span className="ornate-button-text">{children}</span>
    </button>
  );
}
