import { pgTable, text, serial, integer, boolean, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  full_name: text("full_name"),
  phone: text("phone"),
  avatar_url: text("avatar_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  capacity: integer("capacity"),
  participant_fields: jsonb("participant_fields").notNull(),
  flier_data: text("flier_data"),
  created_by: uuid("created_by").notNull().references(() => users.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const participants = pgTable("participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  event_id: uuid("event_id").notNull().references(() => events.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  data: jsonb("data"), // Additional custom fields as JSON
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const check_ins = pgTable("check_ins", {
  id: uuid("id").primaryKey().defaultRandom(),
  event_id: uuid("event_id").notNull().references(() => events.id),
  participant_id: uuid("participant_id").notNull().references(() => participants.id),
  checked_in_at: timestamp("checked_in_at").defaultNow().notNull(),
  location_data: jsonb("location_data"),
  ip_address: text("ip_address"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  full_name: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  date: true,
  time: true,
  location: true,
  capacity: true,
  participant_fields: true,
  flier_data: true,
});

export const insertParticipantSchema = createInsertSchema(participants).pick({
  event_id: true,
  name: true,
  email: true,
  data: true,
});

export const insertCheckInSchema = createInsertSchema(check_ins).pick({
  event_id: true,
  participant_id: true,
  location_data: true,
  ip_address: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
export type Participant = typeof participants.$inferSelect;
export type InsertCheckIn = z.infer<typeof insertCheckInSchema>;
export type CheckIn = typeof check_ins.$inferSelect;
