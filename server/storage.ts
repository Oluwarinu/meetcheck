import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and } from "drizzle-orm";
import { 
  users, events, participants, check_ins, event_templates, event_metrics, 
  subscriptions, notification_preferences,
  type User, type InsertUser, type Event, type InsertEvent, 
  type Participant, type InsertParticipant, type CheckIn, type InsertCheckIn,
  type EventTemplate, type InsertEventTemplate, type Subscription, type InsertSubscription,
  type EventMetric, type NotificationPreferences, type InsertNotificationPreferences
} from "@shared/schema";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Event operations
  getEvents(userId: string): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent & { created_by: string }): Promise<Event>;
  updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined>;
  
  // Event template operations
  getEventTemplates(): Promise<EventTemplate[]>;
  createEventTemplate(template: InsertEventTemplate): Promise<EventTemplate>;
  
  // Participant operations
  getEventParticipants(eventId: string): Promise<Participant[]>;
  createParticipant(participant: InsertParticipant): Promise<Participant>;
  
  // Check-in operations
  getEventCheckIns(eventId: string): Promise<CheckIn[]>;
  createCheckIn(checkIn: InsertCheckIn): Promise<CheckIn>;
  
  // Analytics operations
  getEventMetrics(eventId: string): Promise<EventMetric | undefined>;
  updateEventMetrics(eventId: string): Promise<void>;
  
  // Subscription operations
  getUserSubscription(userId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(userId: string, updates: Partial<Subscription>): Promise<Subscription | undefined>;
  
  // Notification preferences
  getNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined>;
  updateNotificationPreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences | undefined>;
  
  // Authentication
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}

export class PostgresStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const hashedPassword = await this.hashPassword(user.password);
    const result = await db.insert(users).values({
      ...user,
      password: hashedPassword,
    }).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async getEvents(userId: string): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.created_by, userId));
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return result[0];
  }

  async createEvent(event: InsertEvent & { created_by: string }): Promise<Event> {
    const result = await db.insert(events).values(event).returning();
    return result[0];
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined> {
    const result = await db.update(events)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(events.id, id))
      .returning();
    return result[0];
  }

  async getEventParticipants(eventId: string): Promise<Participant[]> {
    return await db.select().from(participants).where(eq(participants.event_id, eventId));
  }

  async createParticipant(participant: InsertParticipant): Promise<Participant> {
    const result = await db.insert(participants).values(participant).returning();
    return result[0];
  }

  async getEventCheckIns(eventId: string): Promise<CheckIn[]> {
    return await db.select().from(check_ins).where(eq(check_ins.event_id, eventId));
  }

  async createCheckIn(checkIn: InsertCheckIn): Promise<CheckIn> {
    const result = await db.insert(check_ins).values(checkIn).returning();
    return result[0];
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  // Event template operations
  async getEventTemplates(): Promise<EventTemplate[]> {
    return db.select().from(event_templates);
  }

  async createEventTemplate(template: InsertEventTemplate): Promise<EventTemplate> {
    const [newTemplate] = await db.insert(event_templates).values(template).returning();
    return newTemplate;
  }

  // Analytics operations
  async getEventMetrics(eventId: string): Promise<EventMetric | undefined> {
    const [metric] = await db.select().from(event_metrics).where(eq(event_metrics.event_id, eventId));
    return metric;
  }

  async updateEventMetrics(eventId: string): Promise<void> {
    const participants = await this.getEventParticipants(eventId);
    const checkIns = await this.getEventCheckIns(eventId);
    
    const totalParticipants = participants.length;
    const totalCheckIns = checkIns.length;
    const uniqueParticipants = new Set(checkIns.map(c => c.participant_id)).size;
    const checkInRate = totalParticipants > 0 ? Math.round((uniqueParticipants / totalParticipants) * 100) : 0;

    // Check if metrics exist
    const existing = await this.getEventMetrics(eventId);
    
    if (existing) {
      await db.update(event_metrics)
        .set({
          total_participants: totalParticipants,
          total_check_ins: totalCheckIns,
          unique_participants: uniqueParticipants,
          check_in_rate: checkInRate,
          last_updated: new Date()
        })
        .where(eq(event_metrics.event_id, eventId));
    } else {
      await db.insert(event_metrics).values({
        event_id: eventId,
        total_participants: totalParticipants,
        total_check_ins: totalCheckIns,
        unique_participants: uniqueParticipants,
        check_in_rate: checkInRate
      });
    }
  }

  // Subscription operations
  async getUserSubscription(userId: string): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.user_id, userId));
    return subscription;
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [newSubscription] = await db.insert(subscriptions).values(subscription).returning();
    return newSubscription;
  }

  async updateSubscription(userId: string, updates: Partial<Subscription>): Promise<Subscription | undefined> {
    const [updated] = await db.update(subscriptions)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(subscriptions.user_id, userId))
      .returning();
    return updated;
  }

  // Notification preferences
  async getNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined> {
    const [preferences] = await db.select().from(notification_preferences).where(eq(notification_preferences.user_id, userId));
    return preferences;
  }

  async updateNotificationPreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences | undefined> {
    const existing = await this.getNotificationPreferences(userId);
    
    if (existing) {
      const [updated] = await db.update(notification_preferences)
        .set(preferences)
        .where(eq(notification_preferences.user_id, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(notification_preferences)
        .values({ user_id: userId, ...preferences })
        .returning();
      return created;
    }
  }
}

export const storage = new PostgresStorage();
