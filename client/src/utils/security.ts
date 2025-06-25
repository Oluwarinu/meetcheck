export function validateEventId(id: string): boolean {
  // Basic validation for event ID format
  return /^[a-zA-Z0-9-_]+$/.test(id) && id.length > 0 && id.length < 100;
}

export function validateEmail(email: string): boolean {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeInput(input: string): string {
  // Remove potentially harmful characters
  return input.replace(/[<>'"&]/g, '');
}

export function generateCSRFToken(): string {
  // Generate a simple CSRF token
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}