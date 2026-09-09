export interface PaymeConfig {
  merchantId: string;
  secretKey: string;
}

export function getPaymeConfig(): PaymeConfig {
  return {
    merchantId: process.env.PAYME_MERCHANT_ID || '',
    secretKey: process.env.PAYME_SECRET_KEY || ''
  };
}

/**
 * Generates direct payment link for Payme Uzbekistan
 * Example: https://checkout.paycom.uz/<base64(m=...;ac.order_id=...;a=tiyin)>
 */
export function generatePaymePaymentUrl(orderId: string, amountSom: number): string {
  const config = getPaymeConfig();
  const merchantId = config.merchantId || 'payme_merchant_demo';
  // Payme requires amount in TIYIN (1 Som = 100 Tiyin)
  const amountTiyin = Math.round(amountSom * 100);

  const rawParams = `m=${merchantId};ac.order_id=${orderId};a=${amountTiyin}`;
  const base64Params = Buffer.from(rawParams).toString('base64');

  return `https://checkout.paycom.uz/${base64Params}`;
}

/**
 * Validates Payme HTTP Basic Auth Header
 */
export function verifyPaymeAuth(authHeader: string | null): boolean {
  const { secretKey } = getPaymeConfig();
  if (!secretKey) return true; // dev mode bypass
  if (!authHeader || !authHeader.startsWith('Basic ')) return false;

  const credentials = Buffer.from(authHeader.replace('Basic ', ''), 'base64').toString('utf-8');
  const [, key] = credentials.split(':');
  return key === secretKey;
}
