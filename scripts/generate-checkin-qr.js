// Node.js script to generate a check-in QR code for an event participant
// Usage: node generate-checkin-qr.js <eventId> <participantId> <secret>
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');

const [,, eventId, participantId, secret] = process.argv;
if (!eventId || !participantId || !secret) {
  console.error('Usage: node generate-checkin-qr.js <eventId> <participantId> <secret>');
  process.exit(1);
}

const payload = {
  event_id: eventId,
  participant_id: participantId,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours
};

const token = jwt.sign(payload, secret, { algorithm: 'HS256' });

QRCode.toDataURL(token, (err, url) => {
  if (err) {
    console.error('Failed to generate QR code:', err);
    process.exit(1);
  }
  console.log('QR Code Data URL:');
  console.log(url);
  console.log('\nRaw JWT:');
  console.log(token);
}); 