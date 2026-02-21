import { X, Star, Lock, Unlock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { PAYPAL_CLIENT_ID } from '../utils/env';

interface PayPalPremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseSuccess: () => void;
  userEmail?: string;
}

// PayPal SDK types
declare global {
  interface Window {
    paypal?: any;
  }
}

export function PayPalPremiumModal({ isOpen, onClose, onPurchaseSuccess, userEmail }: PayPalPremiumModalProps) {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isOpen && !window.paypal) {
      // Load PayPal SDK
      const script = document.createElement('script');
      const clientId = PAYPAL_CLIENT_ID || 'test';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
      script.async = true;
      script.onload = () => {
        setPaypalLoaded(true);
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else if (window.paypal) {
      setPaypalLoaded(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (paypalLoaded && isOpen) {
      // Render PayPal button
      const container = document.getElementById('paypal-button-container');
      if (container && !container.hasChildNodes()) {
        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'pill',
            label: 'paypal'
          },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: 'Tarot Premium - 완전한 해석 언락',
                amount: {
                  value: '4.99' // $4.99 one-time payment
                }
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            setProcessing(true);
            try {
              const order = await actions.order.capture();
              console.log('Payment successful:', order);

              // Send to server for verification
              const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-adbcd17e/payment/verify`;
              console.log('Verifying payment at:', apiUrl);
              
              const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${publicAnonKey}`
                },
                body: JSON.stringify({
                  orderId: order.id,
                  email: userEmail,
                  paymentDetails: order
                })
              });

              if (response.ok) {
                onPurchaseSuccess();
                onClose();
              } else {
                const errorData = await response.json();
                console.error('Verification failed:', errorData);
                alert('결제 검증에 실패했습니다. 고객센터로 문의해주세요.');
              }
            } catch (error) {
              console.error('Payment error:', error);
              alert('결제 처리 중 오류가 발생했습니다.');
            } finally {
              setProcessing(false);
            }
          },
          onError: (err: any) => {
            console.error('PayPal error:', err);
            alert('결제 중 오류가 발생했습니다.');
          }
        }).render('#paypal-button-container');
      }
    }
  }, [paypalLoaded, isOpen, onPurchaseSuccess, onClose, userEmail]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="modal-content"
          style={{
            borderRadius: '1.5rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            position: 'relative'
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <X size={20} color="var(--text-secondary)" />
          </button>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                fontSize: '4rem',
                marginBottom: '1rem',
                filter: 'drop-shadow(0 0 30px rgba(245, 158, 11, 0.8))'
              }}
            >
              ✨
            </motion.div>

            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #F59E0B, #FCD34D, #F59E0B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem'
            }}>
              프리미엄 언락
            </h2>

            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6
            }}>
              우주의 완전한 메시지를 받아보세요
            </p>
          </div>

          {/* Premium Features */}
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <Unlock size={20} color="var(--primary-gold)" />
              <span style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                프리미엄 혜택
              </span>
            </div>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {[
                '🔮 모든 카드의 완전한 해석 공개',
                '💫 당신만을 위한 맞춤 조언',
                '⭐ 구체적인 행동 가이드',
                '📜 무제한 리딩 히스토리 저장',
                '🎯 더 깊이 있는 타로 통찰',
                '🚫 광고 완전 제거'
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    fontSize: '0.9375rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    lineHeight: 1.6
                  }}
                >
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 700,
              color: 'var(--primary-gold)',
              marginBottom: '0.5rem'
            }}>
              $4.99
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-muted)'
            }}>
              평생 사용 • 단 한 번의 결제
            </p>
          </div>

          {/* PayPal Button Container */}
          {processing ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem'
            }}>
              <div style={{
                fontSize: '2rem',
                marginBottom: '1rem'
              }}>
                ⏳
              </div>
              <p style={{
                color: 'var(--text-secondary)'
              }}>
                결제를 처리하고 있습니다...
              </p>
            </div>
          ) : (
            <div id="paypal-button-container" style={{
              marginBottom: '1rem'
            }}></div>
          )}

          {!paypalLoaded && !processing && (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--text-secondary)'
            }}>
              PayPal 결제를 불러오는 중...
            </div>
          )}

          {/* Security Note */}
          <div style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '1rem',
            lineHeight: 1.5
          }}>
            <Lock size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
            안전한 PayPal 결제 시스템으로 보호됩니다
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
