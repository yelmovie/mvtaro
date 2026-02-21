# 환경 변수 설정 가이드

## 📁 파일 구조

```
프로젝트 루트/
├── .env.example   ← 복사 기준 (Git 에 포함)
├── .env           ← 실제 값 입력 (Git 에 포함 안 됨, .gitignore 처리)
└── src/lib/config/env.ts  ← 단일 config 소스 (코드에서 이 파일만 읽음)
```

---

## 1단계: .env 파일 생성

PowerShell에서 실행:
```powershell
cd C:\moviesam\mvtaro
Copy-Item .env.example .env
```

---

## 2단계: 각 환경 변수 설정

### 🔵 Supabase (필수)

**어디서 찾나요?**
1. https://supabase.com/dashboard 로그인
2. 프로젝트 선택 → **Settings** (좌측 하단)
3. **API** 탭 클릭
4. **Project URL** → `VITE_SUPABASE_URL` 에 입력
5. **anon / public** 키 → `VITE_SUPABASE_ANON_KEY` 에 입력

**.env 에 입력할 내용:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Smoke Test (선택):**
앱 실행 후 브라우저 콘솔에서:
```js
window.__supabaseSmoke()
```
`✅ Supabase 연결 성공` 이 출력되면 정상입니다.

---

### 🟡 PayPal Sandbox (선택 — 결제 기능 테스트 시 필요)

**어디서 찾나요?**
1. https://developer.paypal.com/dashboard/ 로그인
2. **Apps & Credentials** 탭
3. **Sandbox** 탭 선택
4. 앱 생성(Create App) 또는 기존 앱 클릭
5. **Client ID** 복사

**.env 에 입력할 내용:**
```env
VITE_PAYPAL_CLIENT_ID=AXxx...sandbox_client_id...
```

> **주의:** Sandbox Client ID와 Live Client ID는 다릅니다.
> 실 서비스 전환 시 반드시 Live Client ID로 교체하세요.

---

### 🟢 Google AdSense (선택)

**어디서 찾나요?**
1. https://www.google.com/adsense 로그인
2. 왼쪽 메뉴 → **계정** → **계정 정보**
3. **게시자 ID** 복사 (형식: `ca-pub-XXXXXXXXXXXXXXXX`)

**.env 에 입력할 내용:**
```env
VITE_ADSENSE_CLIENT_ID=ca-pub-0000000000000000
```

> AdSense는 승인이 필요합니다 (며칠~수 주 소요).
> 개발 중에는 설정하지 않아도 됩니다.

---

## 3단계: 서버(Edge Function) 비밀 키 설정

> ⚠️ 아래 키들은 `.env` 파일에 넣지 않습니다.
> Supabase Edge Function 환경 변수(Secrets)에만 설정합니다.

**Supabase Dashboard → Settings → Edge Functions → Secrets 에서 추가:**

| 변수명 | 설명 | 어디서 찾나요? |
|--------|------|---------------|
| `OPENAI_API_KEY` | GPT API 키 | https://platform.openai.com/api-keys |
| `PAYPAL_CLIENT_SECRET` | PayPal 서버 비밀 키 | PayPal Developer Dashboard → 해당 앱 |

---

## 4단계: 로컬 실행

```powershell
cd C:\moviesam\mvtaro
pnpm install
pnpm run dev
```

브라우저에서 `http://localhost:3000` 열기

---

## ✅ 동작 확인 체크리스트

- [ ] `pnpm run dev` 실행 시 오류 없음
- [ ] 홈 화면 로딩됨
- [ ] 브라우저 콘솔에 `VITE_SUPABASE_URL 미설정` 경고 없음 (설정한 경우)
- [ ] `window.__supabaseSmoke()` → `✅ Supabase 연결 성공`
- [ ] 타로 결과 화면에서 AI 해석 로딩됨 (OPENAI_API_KEY 설정된 경우)
- [ ] PayPal 프리미엄 버튼 클릭 시 PayPal 창 열림 (PAYPAL_CLIENT_ID 설정된 경우)
