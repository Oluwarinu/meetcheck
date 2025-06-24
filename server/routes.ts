import type { Express } from "express";
import { createServer, type Server } from "http";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { insertUserSchema, insertEventSchema } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-change-in-production";

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = await storage.createUser(userData);
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({ 
        user: { ...user, password: undefined }, 
        token 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await storage.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({ 
        user: { ...user, password: undefined }, 
        token 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not for security
        return res.json({ message: 'If the email exists, a reset link has been sent.' });
      }

      // TODO: Implement actual password reset email sending
      res.json({ message: 'If the email exists, a reset link has been sent.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/auth/profile', authenticateToken, async (req, res) => {
    res.json({ ...req.user, password: undefined });
  });

  app.put('/api/auth/profile', authenticateToken, async (req, res) => {
    try {
      const updates = req.body;
      const updatedUser = await storage.updateUser(req.user.id, updates);
      res.json({ ...updatedUser, password: undefined });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Event routes
  app.get('/api/events', authenticateToken, async (req, res) => {
    try {
      const events = await storage.getEvents(req.user.id);
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/events', authenticateToken, async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent({
        ...eventData,
        created_by: req.user.id
      });
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/events/:id', authenticateToken, async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      // Check if user owns the event
      if (event.created_by !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Participant routes
  app.get('/api/events/:id/participants', authenticateToken, async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event || event.created_by !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      const participants = await storage.getEventParticipants(req.params.id);
      res.json(participants);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/events/:id/participants', async (req, res) => {
    try {
      const { name, email, data } = req.body;
      const participant = await storage.createParticipant({
        event_id: req.params.id,
        name,
        email,
        data
      });
      res.json(participant);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Public event check-in (no auth required)
  app.get('/api/public/events/:id', async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Check if check-in is still enabled and within deadline
      if (!event.checkin_enabled) {
        return res.status(403).json({ error: 'Check-in is disabled for this event' });
      }

      if (event.checkin_deadline && new Date() > new Date(event.checkin_deadline)) {
        return res.status(403).json({ error: 'Check-in deadline has passed' });
      }

      // Return only public information
      res.json({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        participant_fields: event.participant_fields,
        flier_data: event.flier_data,
        checkin_enabled: event.checkin_enabled,
        checkin_deadline: event.checkin_deadline
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/public/events/:id/checkin', async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Check if check-in is still enabled and within deadline
      if (!event.checkin_enabled) {
        return res.status(403).json({ error: 'Check-in is disabled for this event' });
      }

      if (event.checkin_deadline && new Date() > new Date(event.checkin_deadline)) {
        return res.status(403).json({ error: 'Check-in deadline has passed' });
      }

      const { name, email, data, location_data, ip_address } = req.body;
      
      // Create participant first
      const participant = await storage.createParticipant({
        event_id: req.params.id,
        name,
        email,
        data
      });

      // Then create check-in
      const checkIn = await storage.createCheckIn({
        event_id: req.params.id,
        participant_id: participant.id,
        location_data,
        ip_address
      });
      
      // Update event metrics after check-in
      await storage.updateEventMetrics(req.params.id);
      
      res.json({ participant, checkIn, message: 'Successfully checked in!' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Check-in routes
  app.get('/api/events/:id/checkins', authenticateToken, async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event || event.created_by !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      const checkIns = await storage.getEventCheckIns(req.params.id);
      res.json(checkIns);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/events/:id/checkin', async (req, res) => {
    try {
      const { participant_id, location_data, ip_address } = req.body;
      const checkIn = await storage.createCheckIn({
        event_id: req.params.id,
        participant_id,
        location_data,
        ip_address
      });
      
      // Update event metrics after check-in
      await storage.updateEventMetrics(req.params.id);
      
      res.json(checkIn);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Analytics route (migrated from Supabase Edge Function)
  app.get('/api/events/:id/analytics', authenticateToken, async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event || event.created_by !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Update metrics first
      await storage.updateEventMetrics(req.params.id);
      
      // Get updated metrics
      const metrics = await storage.getEventMetrics(req.params.id);
      
      if (!metrics) {
        return res.status(404).json({ error: 'Metrics not found' });
      }
      
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Event templates routes
  app.get('/api/event-templates', async (req, res) => {
    try {
      const templates = await storage.getEventTemplates();
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/event-templates', authenticateToken, async (req, res) => {
    try {
      const templateData = req.body;
      const template = await storage.createEventTemplate(templateData);
      res.json(template);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Subscription routes
  app.get('/api/subscription', authenticateToken, async (req, res) => {
    try {
      let subscription = await storage.getUserSubscription(req.user.id);
      
      // Create default subscription if none exists
      if (!subscription) {
        subscription = await storage.createSubscription({
          user_id: req.user.id,
          tier: 'freemium',
          status: 'active'
        });
      }
      
      res.json(subscription);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/subscription', authenticateToken, async (req, res) => {
    try {
      const updates = req.body;
      const subscription = await storage.updateSubscription(req.user.id, updates);
      res.json(subscription);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Notification preferences routes
  app.get('/api/notification-preferences', authenticateToken, async (req, res) => {
    try {
      const preferences = await storage.getNotificationPreferences(req.user.id);
      res.json(preferences);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/notification-preferences', authenticateToken, async (req, res) => {
    try {
      const preferences = req.body;
      const updated = await storage.updateNotificationPreferences(req.user.id, preferences);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Payment routes
  app.post('/api/payments/initialize', authenticateToken, async (req, res) => {
    try {
      const { email, amount, plan, metadata } = req.body;
      
      // Initialize payment with Paystack
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          amount: amount * 100, // Convert to kobo
          currency: 'NGN',
          plan,
          metadata: {
            user_id: req.user.id,
            ...metadata
          }
        })
      });

      const data = await response.json();
      
      if (data.status) {
        res.json(data.data);
      } else {
        res.status(400).json({ error: data.message });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/payments/verify', authenticateToken, async (req, res) => {
    try {
      const { reference } = req.body;
      
      // Verify payment with Paystack
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      });

      const data = await response.json();
      
      if (data.status && data.data.status === 'success') {
        // Update user subscription in database
        const subscriptionData = {
          user_id: req.user.id,
          tier: data.data.metadata.plan || 'professional',
          status: 'active',
          started_at: new Date(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          payment_reference: reference
        };

        await storage.createSubscription(subscriptionData);
        
        res.json({ 
          success: true, 
          message: 'Payment verified and subscription activated',
          subscription: subscriptionData
        });
      } else {
        res.status(400).json({ error: 'Payment verification failed' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Event management routes
  app.put('/api/events/:id', authenticateToken, async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event || event.created_by !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updates = req.body;
      const updatedEvent = await storage.updateEvent(req.params.id, updates);
      res.json(updatedEvent);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/events/:id', authenticateToken, async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event || event.created_by !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      await storage.deleteEvent(req.params.id);
      res.json({ message: 'Event deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
