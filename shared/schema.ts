import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  abstract: text("abstract").notNull(),
  content: text("content").notNull(),
  authors: text("authors").array().notNull(),
  keywords: text("keywords").array().notNull(),
  category: text("category").notNull(), // "research", "review", "methods", "case-study"
  status: text("status").notNull().default("draft"), // "draft", "under-review", "published"
  issue: text("issue"),
  volume: text("volume"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  featured: boolean("featured").default(false),
  readTime: integer("read_time").notNull(), // in minutes
  imageUrl: text("image_url"),
  doi: text("doi"),
  citations: integer("citations").default(0)
});

export const editors = pgTable("editors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  specialization: text("specialization").notNull(),
  email: text("email").notNull(),
  imageUrl: text("image_url"),
  bio: text("bio")
});

export const issues = pgTable("issues", {
  id: serial("id").primaryKey(),
  volume: text("volume").notNull(),
  issue: text("issue").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  publishedAt: timestamp("published_at"),
  current: boolean("current").default(false)
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  publishedAt: true
});

export const insertEditorSchema = createInsertSchema(editors).omit({
  id: true
});

export const insertIssueSchema = createInsertSchema(issues).omit({
  id: true,
  publishedAt: true
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;
export type InsertEditor = z.infer<typeof insertEditorSchema>;
export type Editor = typeof editors.$inferSelect;
export type InsertIssue = z.infer<typeof insertIssueSchema>;
export type Issue = typeof issues.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
