/**
 * 하위 호환 re-export.
 * 기존 코드에서 '../utils/env' 를 그대로 import 할 수 있도록 유지합니다.
 * 새 코드는 '@/lib/config/env' 를 직접 사용하세요.
 */
export { env } from '@/lib/config/env';

// 기존 named export 호환 (PayPalPremiumModal, GoogleAdSense 에서 사용)
import { env } from '@/lib/config/env';
export const PAYPAL_CLIENT_ID = env.paypalClientId;
export const ADSENSE_CLIENT_ID = env.adsenseClientId;
