# Upstage API Module

Minimal Upstage API integration module.

## Setup

1. Create `.env` file in project root
2. Set `VITE_UPSTAGE_API_KEY=your_key_here`
3. Restart dev server

## Usage

```typescript
import { isUpstageEnabled, upstageChat } from '@/api/upstage';

if (isUpstageEnabled()) {
  const result = await upstageChat({
    messages: [{ role: 'user', content: 'Hello' }],
  });
}
```
