import { Home, BookOpen, Settings } from 'lucide-react';

interface NavigationProps {
  currentPage: 'home' | 'history' | 'settings';
  onNavigate: (page: 'home' | 'history' | 'settings') => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="nav-container">
      <div className="nav-inner">
        <button
          onClick={() => onNavigate('home')}
          className={`nav-button ${
            currentPage === 'home' ? 'nav-button-active' : 'nav-button-inactive'
          }`}
        >
          <Home style={{ width: '1.25rem', height: '1.25rem' }} />
          <span style={{ fontSize: '0.75rem' }}>홈</span>
        </button>

        <button
          onClick={() => onNavigate('history')}
          className={`nav-button ${
            currentPage === 'history' ? 'nav-button-active' : 'nav-button-inactive'
          }`}
        >
          <BookOpen style={{ width: '1.25rem', height: '1.25rem' }} />
          <span style={{ fontSize: '0.75rem' }}>기록</span>
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className={`nav-button ${
            currentPage === 'settings' ? 'nav-button-active' : 'nav-button-inactive'
          }`}
        >
          <Settings style={{ width: '1.25rem', height: '1.25rem' }} />
          <span style={{ fontSize: '0.75rem' }}>설정</span>
        </button>
      </div>
    </nav>
  );
}
