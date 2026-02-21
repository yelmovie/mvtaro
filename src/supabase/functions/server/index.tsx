import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { 
  generateTarotInterpretation, 
  generateDailyFortune, 
  generateCompatibility 
} from "./ai-service.tsx";
import { verifyPayPalPayment } from "./payment-service.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-adbcd17e/health", (c) => {
  return c.json({ status: "ok" });
});

// Tarot interpretation endpoint
app.post("/make-server-adbcd17e/tarot/interpret", async (c) => {
  try {
    const body = await c.req.json();
    console.log("Tarot interpretation request:", body);
    
    const interpretation = await generateTarotInterpretation(body);
    
    // Store reading in database
    const readingId = `reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(readingId, {
      ...body,
      interpretation,
      timestamp: new Date().toISOString()
    });
    
    return c.json({ 
      success: true, 
      interpretation,
      readingId 
    });
  } catch (error) {
    console.error("Error in tarot interpretation:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// Daily fortune endpoint
app.post("/make-server-adbcd17e/fortune/daily", async (c) => {
  try {
    const { birthDate, gender } = await c.req.json();
    console.log("Daily fortune request:", { birthDate, gender });
    
    const fortune = await generateDailyFortune(birthDate, gender);
    
    return c.json({ 
      success: true, 
      fortune,
      date: new Date().toLocaleDateString('ko-KR')
    });
  } catch (error) {
    console.error("Error in daily fortune:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// Compatibility endpoint
app.post("/make-server-adbcd17e/compatibility", async (c) => {
  try {
    const { user1Birth, user2Birth } = await c.req.json();
    console.log("Compatibility request:", { user1Birth, user2Birth });
    
    const compatibility = await generateCompatibility(user1Birth, user2Birth);
    
    return c.json({ 
      success: true, 
      compatibility
    });
  } catch (error) {
    console.error("Error in compatibility:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// Get past reading
app.get("/make-server-adbcd17e/reading/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const reading = await kv.get(`reading_${id}`);
    
    if (!reading) {
      return c.json({ success: false, error: "Reading not found" }, 404);
    }
    
    return c.json({ success: true, reading });
  } catch (error) {
    console.error("Error fetching reading:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// Email sending endpoint (placeholder - requires email service setup)
app.post("/make-server-adbcd17e/email/send", async (c) => {
  try {
    const { email, readingId, content } = await c.req.json();
    console.log("Email send request:", { email, readingId });
    
    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    // For now, just store the email request
    await kv.set(`email_${Date.now()}`, {
      email,
      readingId,
      content,
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
    
    return c.json({ 
      success: true, 
      message: "이메일 전송이 예약되었습니다" 
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// Sign up endpoint
app.post("/make-server-adbcd17e/signup", async (c) => {
  try {
    const { email, password } = await c.req.json();
    console.log("Signup request:", { email });
    
    // Create Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
    
    // Create user with auto-confirmation
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.error("Signup error:", error);
      throw error;
    }
    
    return c.json({ 
      success: true, 
      user: data.user
    });
  } catch (error: any) {
    console.error("Error in signup:", error);
    return c.json({ 
      success: false, 
      error: error.message || "회원가입 중 오류가 발생했습니다" 
    }, 500);
  }
});

// PayPal payment verification endpoint
app.post("/make-server-adbcd17e/payment/verify", async (c) => {
  try {
    const { orderId, email, paymentDetails } = await c.req.json();
    console.log("Payment verification request:", { orderId, email });
    
    // Verify payment with PayPal
    const isValid = await verifyPayPalPayment({ orderId, email, paymentDetails });
    
    if (!isValid) {
      return c.json({ 
        success: false, 
        error: "결제 검증에 실패했습니다" 
      }, 400);
    }
    
    // Grant premium status
    const premiumKey = `premium:${email}`;
    await kv.set(premiumKey, {
      isPremium: true,
      purchaseDate: new Date().toISOString(),
      orderId: orderId,
      plan: "lifetime",
      email: email
    });
    
    console.log(`Premium granted to ${email}`);
    
    return c.json({ 
      success: true, 
      message: "프리미엄이 활성화되었습니다!" 
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// Check premium status endpoint
app.get("/make-server-adbcd17e/premium/check/:email", async (c) => {
  try {
    const email = c.req.param("email");
    console.log("Premium check request:", { email });
    
    const premiumKey = `premium:${email}`;
    const premiumData = await kv.get(premiumKey);
    
    return c.json({ 
      success: true, 
      isPremium: premiumData?.isPremium || false,
      data: premiumData
    });
  } catch (error) {
    console.error("Error checking premium status:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// Update user profile endpoint
app.post("/make-server-adbcd17e/profile/update", async (c) => {
  try {
    const { name, birthDate, birthTime, mbti, friendName, personalityAnswers } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
    
    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ 
        success: false, 
        error: "인증이 필요합니다" 
      }, 401);
    }
    
    // Update user metadata
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          name,
          birthDate,
          birthTime,
          mbti,
          friendName,
          personalityAnswers
        }
      }
    );
    
    if (error) {
      console.error("Profile update error:", error);
      throw error;
    }
    
    // Also store in KV for quick access
    await kv.set(`profile_${user.id}`, {
      name,
      birthDate,
      birthTime,
      mbti,
      friendName,
      personalityAnswers,
      updatedAt: new Date().toISOString()
    });
    
    return c.json({ 
      success: true, 
      profile: data.user?.user_metadata
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return c.json({ 
      success: false, 
      error: error.message || "프로필 업데이트 중 오류가 발생했습니다" 
    }, 500);
  }
});

// ─── OpenAI API Key 서버 측 검증 엔드포인트 ──────────────────────────────────
// 브라우저는 이 엔드포인트만 호출합니다 (OpenAI 를 직접 호출하지 않음).
// 실제 키는 Supabase Edge Function 환경 변수(OPENAI_API_KEY)에만 존재합니다.
app.post("/make-server-adbcd17e/openai/validate-key", async (c) => {
  const openaiKey = Deno.env.get("OPENAI_API_KEY");

  if (!openaiKey) {
    return c.json({
      valid: false,
      message: "서버에 OPENAI_API_KEY 가 설정되지 않았습니다. " +
               "Supabase Dashboard → Settings → Edge Functions → Secrets 에서 추가하세요.",
    }, 503);
  }

  try {
    // 서버에서 실제 키로 OpenAI 에 검증 요청 (키를 클라이언트에 노출하지 않음)
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${openaiKey}` },
    });
    if (res.ok) {
      return c.json({ valid: true, message: "OpenAI API 키가 유효합니다." });
    } else {
      const err = await res.json();
      return c.json({
        valid: false,
        message: err?.error?.message ?? "OpenAI 응답 오류",
      }, 400);
    }
  } catch (e) {
    return c.json({ valid: false, message: String(e) }, 500);
  }
});

Deno.serve(app.fetch);