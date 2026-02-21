# 💳 결제 & 광고 설정 가이드

타로 앱에 PayPal 결제와 Google AdSense 광고가 통합되어 있습니다.

---

## 🎯 기능 개요

### 1. PayPal 프리미엄 결제
- **가격**: $4.99 (평생 사용)
- **혜택**:
  - ✅ 모든 타로 카드 완전 해석 공개
  - ✅ 맞춤형 구체적 조언
  - ✅ 무제한 리딩 히스토리
  - ✅ 광고 완전 제거

### 2. Google AdSense 광고
- 비회원/무료 사용자에게만 표시
- 결과 화면 하단에 자연스럽게 배치
- 프리미엄 유저는 광고 없음

---

## 🔧 PayPal 설정 단계

### Sandbox (개발/테스트)

1. https://developer.paypal.com/dashboard/ 로그인
2. **Apps & Credentials** → **Sandbox** 탭
3. **Create App** → 앱 이름 입력 → Sandbox 선택
4. 생성된 앱에서:
   - **Client ID** → `.env` 파일의 `VITE_PAYPAL_CLIENT_ID`
   - **Secret** → Supabase Dashboard Secrets의 `PAYPAL_CLIENT_SECRET`
5. Sandbox 테스트 계정 생성:
   - PayPal Dashboard → **Testing** → **Sandbox accounts**
   - Buyer/Seller 계정 생성 후 테스트 결제 진행

### Live (운영)

1. 동일한 Dashboard에서 **Live** 탭으로 전환
2. Live Client ID/Secret 발급
3. `.env` 파일의 `VITE_PAYPAL_CLIENT_ID` → Live Client ID로 교체
4. Supabase Secrets의 `PAYPAL_CLIENT_SECRET` → Live Secret으로 교체
5. `src/supabase/functions/server/payment-service.tsx` 에서:
   ```tsx
   // Sandbox:
   const PAYPAL_API_URL = "https://api-m.sandbox.paypal.com";
   // Live 전환 시:
   const PAYPAL_API_URL = "https://api-m.paypal.com";
   ```

> ⚠️ **Sandbox → Live 전환 체크리스트**
> - [ ] Live Client ID로 교체
> - [ ] Live Client Secret으로 교체
> - [ ] payment-service.tsx API URL 변경
> - [ ] 환불 정책 서비스 약관에 명시
> - [ ] 청소년 보호 정책 확인

---

## 📢 Google AdSense 설정

### 1. 계정 신청

1. https://www.google.com/adsense 로그인
2. 사이트 URL 입력 및 **승인 신청**
3. 승인까지 **며칠~수 주** 소요

### 2. Publisher ID 발급 (승인 후)

1. AdSense 대시보드 → **계정** → **계정 정보**
2. **Publisher ID** 복사 (`ca-pub-XXXXXXXXXXXXXXXX` 형식)
3. `.env` 파일에 추가:
   ```env
   VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```

### 3. 광고 단위 생성

1. **광고** → **광고 단위** → **디스플레이 광고**
2. 이름 입력, 크기 **반응형** 선택
3. **코드 가져오기** → `data-ad-slot` 값 복사
4. `src/components/screens/ResultScreen.tsx` 에서 ad-slot 값 확인/교체

---

## 🔄 결제 플로우

```
사용자 → 결과화면 "상세 해석" 클릭
       → PayPalPremiumModal 열림
       → PayPal SDK 버튼 렌더링 (VITE_PAYPAL_CLIENT_ID 사용)
       → 사용자 PayPal 로그인 & 결제 완료
       → 프론트엔드: orderId 수신
       → 서버(/payment/verify)로 orderId + email 전송
       → 서버: PayPal API로 orderId 검증 (PAYPAL_CLIENT_SECRET 사용)
       → 서버: KV Store에 premium:{email} 저장
       → 프론트엔드: isPremium=true 설정 → 전체 해석 공개
```

---

## 🗄️ 데이터 저장 구조

프리미엄 상태는 Supabase KV Store에 저장됩니다:

```json
Key: "premium:user@example.com"
Value: {
  "isPremium": true,
  "purchaseDate": "2025-02-21T12:00:00.000Z",
  "orderId": "PAYPAL_ORDER_ID",
  "plan": "lifetime",
  "email": "user@example.com"
}
```

---

## 🧪 테스트 체크리스트

### PayPal Sandbox 테스트
- [ ] `.env`에 Sandbox Client ID 설정
- [ ] Supabase Secrets에 Sandbox Client Secret 설정
- [ ] 앱 실행 → 프리미엄 버튼 클릭 → PayPal 창 열림
- [ ] Sandbox 테스트 계정으로 결제 완료
- [ ] 결과 화면에서 완전 해석 공개 확인
- [ ] 로그아웃 후 재로그인 시 프리미엄 유지 확인

### AdSense 테스트
- [ ] 비회원에게 광고 영역 표시 (승인 전엔 빈 박스)
- [ ] 프리미엄 사용자에게 광고 숨김
- [ ] 모바일/태블릿 반응형 확인

---

## 📞 문제 해결

### PayPal 버튼이 안 뜰 때
1. 브라우저 콘솔 에러 확인
2. `VITE_PAYPAL_CLIENT_ID` 설정 여부 확인
3. Ad Blocker 비활성화

### 결제 검증 실패 시
1. Supabase Edge Function 로그 확인:
   ```
   Supabase Dashboard → Edge Functions → Logs
   ```
2. `PAYPAL_CLIENT_SECRET` 설정 여부 확인
3. Sandbox/Live 모드 일치 여부 확인

### 프리미엄이 유지 안 될 때
1. 로그인 세션(이메일) 일치 확인
2. Supabase KV Store에서 `premium:{email}` 키 조회
