export const BRAND_NAME = '마음코칭 카드';
export const BRAND_TAGLINE = '카드로 내 마음을 천천히 들여다봐요';
export const HOME_QUESTION = '어떤 친구 문제로 고민하고 있나요?';
export const HOME_DESCRIPTION =
  '내 마음을 고르고 카드를 뽑으면, 관계를 풀어갈 힌트를 볼 수 있어요.';
export const HOME_STEP_LABEL = '먼저 고민을 골라보세요';
export const META_DESCRIPTION =
  '친구관계로 고민하는 학생이 감정을 고르고 카드를 통해 내 마음과 관계를 차분히 정리해보는 마음코칭 앱입니다.';

export type ViewMode = 'large' | 'default' | 'focus';

export const VIEW_MODE_OPTIONS: Array<{
  value: ViewMode;
  label: string;
  description: string;
}> = [
  { value: 'large', label: '크게 보기', description: '글자와 버튼을 더 크게 보여줘요.' },
  { value: 'default', label: '기본 보기', description: '가장 균형 있게 보여줘요.' },
  { value: 'focus', label: '집중 보기', description: '핵심 내용에 더 집중하기 쉬워요.' }
];
