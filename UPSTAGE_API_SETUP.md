# Upstage API 연동 가이드

Upstage API를 사용하여 타로 카드 해석을 동적으로 생성하는 기능이 추가되었습니다.

## 📁 폴더 구조

```
src/api/upstage/
├── config.ts          # 환경 변수 및 API 설정 관리
├── client.ts          # Upstage API HTTP 클라이언트
├── types.ts           # TypeScript 타입 정의
├── prompts.ts         # 프롬프트 템플릿 생성
├── interpreter.ts     # 타로 해석 생성 로직
├── index.ts           # 모듈 진입점 (export)
└── README.md          # 상세 사용 가이드
```

## 🔒 보안 설정

### 1. 환경 변수 파일 생성

프로젝트 루트에 `.env` 파일을 생성하세요:

```bash
# .env 파일 (API 키만 입력)
VITE_UPSTAGE_API_KEY=your_actual_api_key_here
```

⚠️ **중요**: `.env` 파일은 Git에 커밋되지 않습니다 (`.gitignore`에 추가됨)

### 2. Upstage API 키 발급

1. https://console.upstage.ai/api-keys?api=chat 에 접속
2. 계정 생성 및 로그인
3. API 키 발급
4. 발급받은 API 키를 `.env` 파일의 `VITE_UPSTAGE_API_KEY`에 입력

### 3. 완료!

API 키만 입력하면 자동으로 활성화됩니다. 다른 설정은 코드에 기본값으로 설정되어 있어 별도 설정이 필요 없습니다.

## 📝 사용 방법

### 기본 사용 예제

```typescript
import {
  generateTarotInterpretation,
  isUpstageApiEnabled,
} from "@/api/upstage";
import { getCardById } from "@/utils/tarotService";
import { mapQuestionIdToType } from "@/lib/getTarotInterpretation";

// API 사용 가능 여부 확인
if (isUpstageApiEnabled()) {
  const card = getCardById("the-fool");
  const questionType = mapQuestionIdToType("friendship-improve");

  if (card) {
    const interpretation = await generateTarotInterpretation({
      cardId: card.id,
      cardName: card.name,
      cardNameEn: card.nameEn,
      orientation: "upright",
      questionType: questionType,
      questionTitle: "친구 관계를 더 좋게 만들고 싶어요",
    });

    if (interpretation) {
      console.log("핵심 메시지:", interpretation.core_message);
      console.log("예언:", interpretation.prediction);
      console.log("징후:", interpretation.signs);
      console.log("긍정적 행동:", interpretation.positive_actions);
    }
  }
}
```

### ResultScreen에서 사용

`src/app/screens/ResultScreen.tsx`에서 기존 해석 로직과 통합할 수 있습니다:

```typescript
import {
  generateTarotInterpretation,
  isUpstageApiEnabled,
} from "@/api/upstage";
import { getTarotInterpretation } from "@/lib/getTarotInterpretation";

// API가 활성화되어 있으면 Upstage API 사용, 아니면 기존 정적 데이터 사용
let interpretationData;
if (isUpstageApiEnabled()) {
  const apiInterpretation = await generateTarotInterpretation({
    cardId: drawnCard.cardId,
    cardName: card.name,
    cardNameEn: card.nameEn,
    orientation: drawnCard.orientation,
    questionType: questionType,
    questionTitle: question?.title,
  });

  if (apiInterpretation) {
    interpretationData = {
      core_message: apiInterpretation.core_message,
      prediction: apiInterpretation.prediction,
      signs: apiInterpretation.signs,
      positive_actions: apiInterpretation.positive_actions,
    };
  } else {
    // API 실패 시 기존 방식 사용
    interpretationData = getTarotInterpretation(
      drawnCard.cardId,
      orientation,
      questionType
    );
  }
} else {
  // API 비활성화 시 기존 방식 사용
  interpretationData = getTarotInterpretation(
    drawnCard.cardId,
    orientation,
    questionType
  );
}
```

## 🛡️ 보안 고려사항

1. **API 키 관리**

   - API 키는 절대 코드에 하드코딩하지 않음
   - 환경 변수(`.env`)로만 관리
   - `.gitignore`에 `.env` 파일이 추가되어 Git에 커밋되지 않음
   - **API 키만 입력하면 됩니다** (다른 설정은 코드에 기본값으로 설정)

2. **에러 처리**

   - API 호출 실패 시 기존 정적 데이터 사용 (fallback)
   - 사용자 경험에 영향 없음
   - API 키는 로그에 출력되지 않음
   - API 키가 없으면 자동으로 기존 정적 데이터 사용

3. **환경 변수**
   - `VITE_UPSTAGE_API_KEY`: API 키 (필수, 유일한 환경 변수)
   - 나머지 설정(URL, 모델 등)은 코드에 기본값으로 설정됨

## 📋 API 응답 형식

```typescript
{
  core_message: string; // 핵심 메시지 (1-2문장)
  prediction: string; // 예언/가능성 (1-2문장)
  signs: [string, string, string]; // 징후 (정확히 3개)
  positive_actions: [string, string, string]; // 긍정적 행동 (정확히 3개)
}
```

## 🔄 동작 방식

1. API 활성화 확인 (`isUpstageApiEnabled()`)
2. 카드 정보 및 질문 타입 수집
3. 프롬프트 생성 (`createInterpretationPrompt()`)
4. Upstage API 호출 (`chatCompletion()`)
5. JSON 응답 파싱 (`parseJsonResponse()`)
6. 응답 검증 (필수 필드 확인)
7. 실패 시 기존 정적 데이터 사용 (fallback)

## ⚠️ 주의사항

- API 호출은 비동기 작업이므로 `async/await` 사용 필요
- API 호출 실패 시 자동으로 기존 정적 데이터 사용
- API 키는 반드시 환경 변수로만 관리
- `.env` 파일은 Git에 커밋하지 않음
