import { createHmac, randomBytes } from 'crypto';
import { NextRequest } from 'next/server';

// Use environment variable secret or fall back to a random key generated at server boot
const JWT_SECRET = process.env.JWT_SECRET || randomBytes(32).toString('hex');

export function generateToken(email: string): string {
  // Set expiration to 24 hours
  const expiry = Date.now() + 24 * 60 * 60 * 1000;
  const payload = JSON.stringify({ email, expiry });
  
  const signature = createHmac('sha256', JWT_SECRET)
    .update(payload)
    .digest('hex');
    
  return `${Buffer.from(payload).toString('base64')}.${signature}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  
  const [payloadBase64, signature] = parts;
  
  try {
    const payloadStr = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    
    // Recreate the signature to verify integrity
    const expectedSignature = createHmac('sha256', JWT_SECRET)
      .update(payloadStr)
      .digest('hex');
      
    if (signature !== expectedSignature) return false;
    
    const parsed = JSON.parse(payloadStr);
    if (parsed.expiry < Date.now()) {
      return false; // Expired token
    }
    
    return true;
  } catch (err) {
    return false;
  }
}

export function isAuthorized(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value;
  return verifyToken(token);
}
