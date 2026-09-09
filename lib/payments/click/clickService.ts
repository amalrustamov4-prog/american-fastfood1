import crypto from 'crypto';

export interface ClickConfig {
  serviceId: string;
  merchantId: string;
  secretKey: string;
}

export function getClickConfig(): ClickConfig {
  return {
    serviceId: process.env.CLICK_SERVICE_ID || '',
    merchantId: process.env.CLICK_MERCHANT_ID || '',
    secretKey: process.env.CLICK_SECRET_KEY || ''
  };
}

/**
 * Generates direct payment link for Click Uzbekistan
 * Example: https://my.click.uz/services/pay?service_id=...&merchant_id=...&amount=...&transaction_param=...
 */
export function generateClickPaymentUrl(orderId: string, amount: number, returnUrl?: string): string {
  const config = getClickConfig();
  const serviceId = config.serviceId || '32000';
  const merchantId = config.merchantId || '24000';

  const params = new URLSearchParams({
    service_id: serviceId,
    merchant_id: merchantId,
    amount: amount.toFixed(2),
    transaction_param: orderId
  });

  if (returnUrl) {
    params.set('return_url', returnUrl);
  }

  return `https://my.click.uz/services/pay?${params.toString()}`;
}

/**
 * Validates Click MD5 Signature for Webhooks
 */
export function verifyClickSign(
  clickTransId: string,
  serviceId: string,
  secretKey: string,
  merchantTransId: string,
  amount: string,
  action: string,
  signTime: string,
  receivedSign: string
): boolean {
  if (!secretKey) return true; // development bypass if keys not yet configured
  const text = `${clickTransId}${serviceId}${secretKey}${merchantTransId}${amount}${action}${signTime}`;
  const mySign = crypto.createHash('md5').update(text).digest('hex');
  return mySign.toLowerCase() === receivedSign.toLowerCase();
}
