export type Language = 'ko' | 'en';

interface Translations {
  // Common
  back: string;
  close: string;
  confirm: string;
  cancel: string;
  next: string;
  skip: string;
  
  // Home Screen
  appTitle: string;
  appSubtitle: string;
  startReading: string;
  dailyFortune: string;
  compatibility: string;
  features: string;
  myProfile: string;
  history: string;
  guide: string;
  settings: string;
  
  // Question Selection
  questionTitle: string;
  questionSubtitle: string;
  relationshipStart: string;
  currentState: string;
  nearFuture: string;
  problem: string;
  advice: string;
  overall: string;
  
  // Card Drawing
  breatheTitle: string;
  breatheDesc: string;
  selectCards: string;
  selectCardsDesc: string;
  selectCardInstruction: string;
  
  // Result Screen
  readingResult: string;
  past: string;
  present: string;
  future: string;
  loadingInterpretation: string;
  saveReading: string;
  shareReading: string;
  newReading: string;
  
  // Settings Page
  settingsDescription: string;
  
  // Appearance
  appearance: string;
  themeMode: string;
  themeModeDesc: string;
  darkMode: string;
  darkModeShort: string;
  darkTheme: string;
  lightMode: string;
  lightTheme: string;
  autoMode: string;
  systemSettings: string;
  
  // General
  general: string;
  language: string;
  languageDesc: string;
  korean: string;
  english: string;
  autoSave: string;
  autoSaveDesc: string;
  
  // About & Support
  aboutSupport: string;
  help: string;
  viewGuide: string;
  privacy: string;
  viewPrivacy: string;
  appVersion: string;
  developer: string;
  developerName: string;
  developerEmail: string;
  contactDeveloper: string;
  send: string;
  sendFeedback: string;
  reportBug: string;
  
  // Data Management
  dataManagement: string;
  dataManagementDesc: string;
  deleteAllData: string;
  deleteConfirm: string;
  dataDeleted: string;
  
  // Profile
  profile: string;
  profileDesc: string;
  enterProfile: string;
  username: string;
  usernamePlaceholder: string;
  birthdate: string;
  birthdatePlaceholder: string;
  saveProfile: string;
  profileSaved: string;
  
  // Premium
  premium: string;
  premiumTitle: string;
  premiumDesc: string;
  premiumFeature1: string;
  premiumFeature2: string;
  premiumFeature3: string;
  premiumPrice: string;
  upgradeToPremium: string;
  alreadyPremium: string;
  
  // Daily Fortune
  dailyFortuneTitle: string;
  dailyFortuneSubtitle: string;
  todaysCard: string;
  overallLuck: string;
  love: string;
  career: string;
  health: string;
  
  // Compatibility
  compatibilityTitle: string;
  compatibilitySubtitle: string;
  person1: string;
  person2: string;
  person1Placeholder: string;
  person2Placeholder: string;
  checkCompatibility: string;
  compatibilityResult: string;
  compatibilityScore: string;
  
  // History
  historyTitle: string;
  historySubtitle: string;
  noHistory: string;
  noHistoryDesc: string;
  viewDetails: string;
  deleteReading: string;
  
  // Guide
  guideTitle: string;
  guideSubtitle: string;
  howToUse: string;
  aboutTarot: string;
  cardMeanings: string;
  
  // Features
  featuresTitle: string;
  featuresSubtitle: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  
  // Messages
  comingSoon: string;
  loading: string;
  error: string;
  success: string;
}

export const translations: Record<Language, Translations> = {
  ko: {
    // Common
    back: '돌아가기',
    close: '닫기',
    confirm: '확인',
    cancel: '취소',
    next: '다음',
    skip: '건너뛰기',
    
    // Home Screen
    appTitle: '마음코칭 카드',
    appSubtitle: '카드로 내 마음을 천천히 정리해보세요',
    startReading: '마음코칭 시작하기',
    dailyFortune: '오늘의 마음',
    compatibility: '궁합 보기',
    features: '기능',
    myProfile: '내 프로필',
    history: '히스토리',
    guide: '가이드',
    settings: '설정',
    
    // Question Selection
    questionTitle: '질문 선택',
    questionSubtitle: '알고 싶은 주제를 선택하세요',
    relationshipStart: '관계의 시작',
    currentState: '현재 상태',
    nearFuture: '가까운 미래',
    problem: '문제점',
    advice: '조언',
    overall: '전반적인 흐름',
    
    // Card Drawing
    breatheTitle: '깊게 호흡하며 집중하세요',
    breatheDesc: '친구관계 고민을 떠올리며 천천히 호흡하세요.',
    selectCards: '카드를 선택하세요',
    selectCardsDesc: '직관에 따라 3장의 카드를 선택하세요',
    selectCardInstruction: '눈을 감고 마음이 가는 카드를 골라보세요',
    
    // Result Screen
    readingResult: '마음코칭 결과',
    past: '과거',
    present: '현재',
    future: '미래',
    loadingInterpretation: '타로의 신비로운 해석을 불러오는 중...',
    saveReading: '저장하기',
    shareReading: '공유하기',
    newReading: '새로운 리딩',
    
    // Settings Page
    settingsDescription: '앱 환경을 개인화하세요',
    
    // Appearance
    appearance: '외관',
    themeMode: '테마 모드',
    themeModeDesc: '화면 테마를 선택하세요',
    darkMode: '다크 모드',
    darkModeShort: '다크',
    darkTheme: '어두운 테마',
    lightMode: '라이트 모드',
    lightTheme: '밝은 테마',
    autoMode: '자동',
    systemSettings: '시스템 설정',
    
    // General
    general: '일반',
    language: '언어',
    languageDesc: '앱 표시 언어',
    korean: '한국어',
    english: 'English',
    autoSave: '자동 저장',
    autoSaveDesc: '앱 설정을 기기에 저장해 다음에도 같은 환경으로 보여줍니다',
    
    // About & Support
    aboutSupport: '정보 & 지원',
    help: '도움말',
    viewGuide: '가이드 보기',
    privacy: '개인정보 처리방침',
    viewPrivacy: '보기',
    appVersion: '앱 버전',
    developer: '개발자',
    developerName: 'Figma Make',
    developerEmail: 'robell.comp@gmail.com',
    contactDeveloper: '문의하기',
    send: '전송',
    sendFeedback: '제안하기',
    reportBug: '오류 문의',
    
    // Data Management
    dataManagement: '데이터 관리',
    dataManagementDesc: '모든 프로필 정보와 히스토리를 삭제합니다. 이 작업은 되돌릴 수 없습니다.',
    deleteAllData: '모든 데이터 삭제',
    deleteConfirm: '정말로 모든 데이터를 삭제하시겠습니까?',
    dataDeleted: '데이터가 삭제되었습니다.',
    
    // Profile
    profile: '프로필',
    profileDesc: '나만의 프로필을 만들어보세요',
    enterProfile: '프로필 입력',
    username: '이름',
    usernamePlaceholder: '이름을 입력하세요',
    birthdate: '생년월일',
    birthdatePlaceholder: 'YYYY-MM-DD',
    saveProfile: '저장하기',
    profileSaved: '프로필이 저장되었습니다',
    
    // Premium
    premium: '프리미엄',
    premiumTitle: '프리미엄 멤버십',
    premiumDesc: '더 깊이 있는 타로 경험을 즐겨보세요',
    premiumFeature1: '더 구체적이고 실용적인 조언',
    premiumFeature2: '무제한 리딩 히스토리',
    premiumFeature3: '광고 없는 깨끗한 경험',
    premiumPrice: '$4.99',
    upgradeToPremium: '프리미엄 업그레이드',
    alreadyPremium: '프리미엄 회원',
    
    // Daily Fortune
    dailyFortuneTitle: '오늘의 운세',
    dailyFortuneSubtitle: '오늘 하루를 위한 카드',
    todaysCard: '오늘의 카드',
    overallLuck: '전체운',
    love: '애정운',
    career: '학업/업무운',
    health: '건강운',
    
    // Compatibility
    compatibilityTitle: '궁합 보기',
    compatibilitySubtitle: '두 사람의 관계를 알아보세요',
    person1: '첫 번째 사람',
    person2: '두 번째 사람',
    person1Placeholder: '첫 번째 사람 이름',
    person2Placeholder: '두 번째 사람 이름',
    checkCompatibility: '궁합 보기',
    compatibilityResult: '궁합 결과',
    compatibilityScore: '궁합 점수',
    
    // History
    historyTitle: '히스토리',
    historySubtitle: '이전 타로 리딩 기록',
    noHistory: '아직 기록이 없습니다',
    noHistoryDesc: '첫 타로 리딩을 시작해보세요',
    viewDetails: '자세히 보기',
    deleteReading: '삭제',
    
    // Guide
    guideTitle: '가이드',
    guideSubtitle: '타로 사용 방법',
    howToUse: '사용 방법',
    aboutTarot: '타로란?',
    cardMeanings: '카드 의미',
    
    // Features
    featuresTitle: '기능',
    featuresSubtitle: '앱의 주요 기능',
    feature1Title: '3장 타로 리딩',
    feature1Desc: '과거-현재-미래를 보는 기본 리딩',
    feature2Title: '일일 운세',
    feature2Desc: '매일 새로운 카드로 운세 확인',
    feature3Title: '궁합 분석',
    feature3Desc: '두 사람의 관계 분석',
    
    // Messages
    comingSoon: '곧 제공됩니다!',
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    success: '성공',
  },
  
  en: {
    // Common
    back: 'Back',
    close: 'Close',
    confirm: 'Confirm',
    cancel: 'Cancel',
    next: 'Next',
    skip: 'Skip',
    
    // Home Screen
    appTitle: 'Mind Coaching Card',
    appSubtitle: 'Take time to organize your feelings with the cards',
    startReading: 'Start Coaching',
    dailyFortune: 'Today\'s Reflection',
    compatibility: 'Compatibility',
    features: 'Features',
    myProfile: 'My Profile',
    history: 'History',
    guide: 'Guide',
    settings: 'Settings',
    
    // Question Selection
    questionTitle: 'Select Question',
    questionSubtitle: 'Choose a topic you want to explore',
    relationshipStart: 'Start of Relationship',
    currentState: 'Current State',
    nearFuture: 'Near Future',
    problem: 'Problem',
    advice: 'Advice',
    overall: 'Overall Flow',
    
    // Card Drawing
    breatheTitle: 'Take a Deep Breath and Focus',
    breatheDesc: 'Think about your friendship concern and breathe slowly.',
    selectCards: 'Select Your Cards',
    selectCardsDesc: 'Choose 3 cards following your intuition',
    selectCardInstruction: 'Select cards that call to you',
    
    // Result Screen
    readingResult: 'Coaching Result',
    past: 'Past',
    present: 'Present',
    future: 'Future',
    loadingInterpretation: 'Loading mystical tarot interpretation...',
    saveReading: 'Save',
    shareReading: 'Share',
    newReading: 'New Reading',
    
    // Settings Page
    settingsDescription: 'Customize your app experience',
    
    // Appearance
    appearance: 'Appearance',
    themeMode: 'Theme Mode',
    themeModeDesc: 'Select your screen theme',
    darkMode: 'Dark Mode',
    darkModeShort: 'Dark',
    darkTheme: 'Dark Theme',
    lightMode: 'Light Mode',
    lightTheme: 'Light Theme',
    autoMode: 'Auto',
    systemSettings: 'System Settings',
    
    // General
    general: 'General',
    language: 'Language',
    languageDesc: 'App Display Language',
    korean: '한국어',
    english: 'English',
    autoSave: 'Auto Save',
    autoSaveDesc: 'Keep app preferences in this device for the next visit',
    
    // About & Support
    aboutSupport: 'About & Support',
    help: 'Help',
    viewGuide: 'View Guide',
    privacy: 'Privacy Policy',
    viewPrivacy: 'View',
    appVersion: 'App Version',
    developer: 'Developer',
    developerName: 'Figma Make',
    developerEmail: 'robell.comp@gmail.com',
    contactDeveloper: 'Contact Us',
    send: 'Send',
    sendFeedback: 'Send Feedback',
    reportBug: 'Report Bug',
    
    // Data Management
    dataManagement: 'Data Management',
    dataManagementDesc: 'Delete all profile information and history. This action cannot be undone.',
    deleteAllData: 'Delete All Data',
    deleteConfirm: 'Are you sure you want to delete all data?',
    dataDeleted: 'Data has been deleted.',
    
    // Profile
    profile: 'Profile',
    profileDesc: 'Create your own profile',
    enterProfile: 'Enter Profile',
    username: 'Name',
    usernamePlaceholder: 'Enter your name',
    birthdate: 'Birth Date',
    birthdatePlaceholder: 'YYYY-MM-DD',
    saveProfile: 'Save',
    profileSaved: 'Profile saved',
    
    // Premium
    premium: 'Premium',
    premiumTitle: 'Premium Membership',
    premiumDesc: 'Enjoy a deeper tarot experience',
    premiumFeature1: 'More specific and practical advice',
    premiumFeature2: 'Unlimited reading history',
    premiumFeature3: 'Ad-free clean experience',
    premiumPrice: '$4.99',
    upgradeToPremium: 'Upgrade to Premium',
    alreadyPremium: 'Premium Member',
    
    // Daily Fortune
    dailyFortuneTitle: 'Daily Fortune',
    dailyFortuneSubtitle: 'Your card for today',
    todaysCard: "Today's Card",
    overallLuck: 'Overall Luck',
    love: 'Love',
    career: 'Career/Study',
    health: 'Health',
    
    // Compatibility
    compatibilityTitle: 'Compatibility',
    compatibilitySubtitle: 'Explore the relationship between two people',
    person1: 'First Person',
    person2: 'Second Person',
    person1Placeholder: 'First person name',
    person2Placeholder: 'Second person name',
    checkCompatibility: 'Check Compatibility',
    compatibilityResult: 'Compatibility Result',
    compatibilityScore: 'Compatibility Score',
    
    // History
    historyTitle: 'History',
    historySubtitle: 'Previous tarot reading records',
    noHistory: 'No records yet',
    noHistoryDesc: 'Start your first tarot reading',
    viewDetails: 'View Details',
    deleteReading: 'Delete',
    
    // Guide
    guideTitle: 'Guide',
    guideSubtitle: 'How to use tarot',
    howToUse: 'How to Use',
    aboutTarot: 'About Tarot',
    cardMeanings: 'Card Meanings',
    
    // Features
    featuresTitle: 'Features',
    featuresSubtitle: 'Main app features',
    feature1Title: '3-Card Tarot Reading',
    feature1Desc: 'Basic reading: Past-Present-Future',
    feature2Title: 'Daily Fortune',
    feature2Desc: 'Check your fortune with a new card daily',
    feature3Title: 'Compatibility Analysis',
    feature3Desc: 'Analyze relationships between two people',
    
    // Messages
    comingSoon: 'Coming soon!',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.ko;
}
