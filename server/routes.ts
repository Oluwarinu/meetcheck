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
      res.json(checkIn);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Analytics route (migrated from Supabase Edge Function)
  app.post('/api/events/:id/analytics', authenticateToken, async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event || event.created_by !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const checkIns = await storage.getEventCheckIns(req.params.id);
      const participants = await storage.getEventParticipants(req.params.id);
      
      const totalCheckIns = checkIns.length;
      const uniqueParticipants = new Set(checkIns.map(c => c.participant_id)).size;
      
      // Basic analytics - can be extended based on requirements
      const analytics = {
        event_id: req.params.id,
        total_check_ins: totalCheckIns,
        unique_participants: uniqueParticipants,
        total_registered: participants.length,
        check_in_rate: participants.length > 0 ? (uniqueParticipants / participants.length) * 100 : 0
      };
      
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
