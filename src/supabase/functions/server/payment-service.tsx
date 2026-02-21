// PayPal payment verification service

interface PayPalVerificationRequest {
  orderId: string;
  email: string;
  paymentDetails: any;
}

const PAYPAL_API_URL = "https://api-m.paypal.com"; // Use sandbox for testing: https://api-m.sandbox.paypal.com
const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID");
const PAYPAL_CLIENT_SECRET = Deno.env.get("PAYPAL_CLIENT_SECRET");

// Get PayPal access token
async function getPayPalAccessToken(): Promise<string> {
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
  
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  if (!response.ok) {
    throw new Error("Failed to get PayPal access token");
  }

  const data = await response.json();
  return data.access_token;
}

// Verify PayPal order
export async function verifyPayPalPayment(
  request: PayPalVerificationRequest
): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken();
    
    // Get order details from PayPal
    const response = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${request.orderId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      console.error("PayPal verification failed:", await response.text());
      return false;
    }

    const orderData = await response.json();
    
    // Verify order is completed
    if (orderData.status !== "COMPLETED") {
      console.error("Order not completed:", orderData.status);
      return false;
    }

    // Verify amount (should be $4.99)
    const amount = parseFloat(orderData.purchase_units[0].amount.value);
    if (amount < 4.99) {
      console.error("Invalid payment amount:", amount);
      return false;
    }

    console.log("Payment verified successfully:", request.orderId);
    return true;
  } catch (error) {
    console.error("PayPal verification error:", error);
    return false;
  }
}

// Grant premium status to user
export async function grantPremiumStatus(
  email: string,
  orderId: string
): Promise<void> {
  const premiumData = {
    isPremium: true,
    purchaseDate: new Date().toISOString(),
    orderId: orderId,
    plan: "lifetime"
  };

  // Store in kv_store with email as key
  const key = `premium:${email}`;
  
  // Note: This would use kv.set() but we're creating the function here
  // The actual implementation will be in the server route
  console.log(`Granting premium to ${email} with order ${orderId}`);
}

// Check if user has premium
export async function checkPremiumStatus(email: string): Promise<boolean> {
  if (!email) return false;
  
  const key = `premium:${email}`;
  
  // Note: This would use kv.get() but we're creating the function here
  // The actual implementation will be in the server route
  console.log(`Checking premium status for ${email}`);
  
  return false; // Will be implemented in server route
}
