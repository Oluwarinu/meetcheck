import { pgTable, text, serial, integer, boolean, timestamp, uuid, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  full_name: text("full_name"),
  phone: text("phone"),
  avatar_url: text("avatar_url"),
  user_role: text("user_role", { enum: ["training_manager", "hr_leader", "educator", "event_organizer"] }),
  organization: text("organization"),
  department: text("department"),
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
  checkin_enabled: boolean("checkin_enabled").default(true),
  checkin_deadline: timestamp("checkin_deadline"), // When QR code expires
  location_verification: boolean("location_verification").default(false),
  industry_type: text("industry_type"), // 'corporate', 'education', 'networking'
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

// Phase 2: Dynamic Event templates table (keeping existing fields + new ones)
export const event_templates = pgTable("event_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // academic, corporate, networking
  participant_fields: jsonb("participant_fields").notNull(), // Legacy field compatibility
  default_capacity: integer("default_capacity"), // Legacy field compatibility
  // New dynamic template fields
  template_type: text("template_type").default("event"), // lecture, assignment, meeting, conference
  dynamic_fields: jsonb("dynamic_fields").default('[]'), // Array of TemplateField configurations
  features: jsonb("features").default('[]'), // Array of TemplateFeature configurations
  max_attendees: integer("max_attendees").default(100),
  duration_hours: integer("duration_hours").default(2),
  is_system_template: boolean("is_system_template").default(true),
  created_by: uuid("created_by").references(() => users.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Assignment submissions table for file uploads and tracking
export const assignment_submissions = pgTable("assignment_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  event_id: uuid("event_id").notNull().references(() => events.id),
  participant_id: uuid("participant_id").notNull().references(() => participants.id),
  student_id: text("student_id").notNull(),
  file_url: text("file_url"), // File storage URL
  file_name: text("file_name"),
  file_size: integer("file_size"),
  submission_date: timestamp("submission_date").defaultNow().notNull(),
  due_date: timestamp("due_date"),
  grade: integer("grade"), // 0-100
  status: text("status").notNull().default("pending"), // pending, submitted, graded, late
  feedback: text("feedback"),
  late_submission: boolean("late_submission").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Grade management for assignments
export const assignment_grades = pgTable("assignment_grades", {
  id: uuid("id").primaryKey().defaultRandom(),
  event_id: uuid("event_id").notNull().references(() => events.id),
  participant_id: uuid("participant_id").notNull().references(() => participants.id),
  assignment_type: text("assignment_type").notNull(), // homework, quiz, project, exam
  grade: integer("grade").notNull(), // 0-100
  weight: integer("weight").default(100), // Grade weight percentage
  graded_by: uuid("graded_by").references(() => users.id),
  graded_at: timestamp("graded_at").defaultNow().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Phase 4: Analytics tables
export const event_metrics = pgTable("event_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  event_id: uuid("event_id").notNull().references(() => events.id),
  total_participants: integer("total_participants").default(0),
  total_check_ins: integer("total_check_ins").default(0),
  unique_participants: integer("unique_participants").default(0),
  check_in_rate: integer("check_in_rate").default(0), // percentage
  peak_check_in_time: timestamp("peak_check_in_time"),
  last_updated: timestamp("last_updated").defaultNow().notNull(),
});

export const user_dashboards = pgTable("user_dashboards", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  dashboard_name: text("dashboard_name").notNull(),
  config: jsonb("config").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const event_predictions = pgTable("event_predictions", {
  id: uuid("id").primaryKey().defaultRandom(),
  event_id: uuid("event_id").notNull().references(() => events.id),
  predicted_attendance: integer("predicted_attendance"),
  predicted_peak_time: timestamp("predicted_peak_time"),
  confidence_score: integer("confidence_score"), // 0-100
  prediction_date: timestamp("prediction_date").defaultNow().notNull(),
});

// Phase 5: Subscription & Billing
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  tier: text("tier").notNull().default("freemium"), // freemium, professional, enterprise
  status: text("status").notNull().default("active"), // active, cancelled, past_due
  current_period_start: timestamp("current_period_start"),
  current_period_end: timestamp("current_period_end"),
  events_this_month: integer("events_this_month").default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Phase 6: Notifications
export const notification_preferences = pgTable("notification_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  email_notifications: boolean("email_notifications").default(true),
  push_notifications: boolean("push_notifications").default(true),
  event_reminders: boolean("event_reminders").default(true),
  check_in_alerts: boolean("check_in_alerts").default(false),
  analytics_reports: boolean("analytics_reports").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
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
  checkin_enabled: true,
  checkin_deadline: true,
  location_verification: true,
  industry_type: true,
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

export const insertEventTemplateSchema = createInsertSchema(event_templates).pick({
  name: true,
  description: true,
  category: true,
  participant_fields: true,
  default_capacity: true,
  template_type: true,
  dynamic_fields: true,
  features: true,
  max_attendees: true,
  duration_hours: true,
  created_by: true,
});

export const insertAssignmentSubmissionSchema = createInsertSchema(assignment_submissions).pick({
  event_id: true,
  participant_id: true,
  student_id: true,
  file_url: true,
  file_name: true,
  file_size: true,
  due_date: true,
  grade: true,
  status: true,
  feedback: true,
  late_submission: true,
});

export const insertAssignmentGradeSchema = createInsertSchema(assignment_grades).pick({
  event_id: true,
  participant_id: true,
  assignment_type: true,
  grade: true,
  weight: true,
  graded_by: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  user_id: true,
  tier: true,
  status: true,
  current_period_start: true,
  current_period_end: true,
});

export const insertNotificationPreferencesSchema = createInsertSchema(notification_preferences).pick({
  user_id: true,
  email_notifications: true,
  push_notifications: true,
  event_reminders: true,
  check_in_alerts: true,
  analytics_reports: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
export type Participant = typeof participants.$inferSelect;
export type InsertCheckIn = z.infer<typeof insertCheckInSchema>;
export type CheckIn = typeof check_ins.$inferSelect;
export type InsertEventTemplate = z.infer<typeof insertEventTemplateSchema>;
export type EventTemplate = typeof event_templates.$inferSelect;
export type InsertAssignmentSubmission = z.infer<typeof insertAssignmentSubmissionSchema>;
export type AssignmentSubmission = typeof assignment_submissions.$inferSelect;
export type InsertAssignmentGrade = z.infer<typeof insertAssignmentGradeSchema>;
export type AssignmentGrade = typeof assignment_grades.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type EventMetric = typeof event_metrics.$inferSelect;
export type UserDashboard = typeof user_dashboards.$inferSelect;
export type EventPrediction = typeof event_predictions.$inferSelect;
export type NotificationPreferences = typeof notification_preferences.$inferSelect;
export type InsertNotificationPreferences = z.infer<typeof insertNotificationPreferencesSchema>;