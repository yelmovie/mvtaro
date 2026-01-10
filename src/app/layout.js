import { ThemeProvider } from '@/contexts/ThemeContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import Header from '@/components/Header';
import './globals.css';

export const metadata = {
  title: '우정 타로 - Friendship Tarot',
  description: '친구 관계에 대한 긍정적이고 성찰적인 타로 리딩',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider>
          <SettingsProvider>
            <Header />
            <main className="min-h-[calc(100vh-4rem)]">
              {children}
            </main>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
