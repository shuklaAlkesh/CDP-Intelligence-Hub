import { pgTable, text, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type CDP = "segment" | "mparticle" | "lytics" | "zeotap";

// Store documentation content
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  cdp: text("cdp").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  cdp: text("cdp").notNull(),
  sources: jsonb("sources").$type<{title: string, url: string}[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  cdp: true,
  title: true,
  content: true,
  url: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  question: true,
  answer: true,
  cdp: true,
  sources: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;