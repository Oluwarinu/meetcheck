import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and } from "drizzle-orm";
import { users, events, participants, check_ins, type User, type InsertUser, type Event, type InsertEvent, type Participant, type InsertParticipant, type CheckIn, type InsertCheckIn } from "@shared/schema";
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
  
  // Participant operations
  getEventParticipants(eventId: string): Promise<Participant[]>;
  createParticipant(participant: InsertParticipant): Promise<Participant>;
  
  // Check-in operations
  getEventCheckIns(eventId: string): Promise<CheckIn[]>;
  createCheckIn(checkIn: InsertCheckIn): Promise<CheckIn>;
  
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
    return await bcrypt.hash(password, 10);
  }
}

export const storage = new PostgresStorage();
