import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import express from "express";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve PDF files from attached_assets/Issues
  app.use('/attached_assets', express.static(path.join(process.cwd(), 'attached_assets')));

  // Articles routes
  app.get("/api/articles", async (req, res) => {
    try {
      const { category, search, featured } = req.query;
      
      let articles;
      if (search) {
        articles = await storage.searchArticles(search as string);
      } else if (featured === "true") {
        articles = await storage.getFeaturedArticles();
      } else if (category) {
        articles = await storage.getArticlesByCategory(category as string);
      } else {
        articles = await storage.getPublishedArticles();
      }
      
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticle(id);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // Editors routes
  app.get("/api/editors", async (req, res) => {
    try {
      const editors = await storage.getEditors();
      res.json(editors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch editors" });
    }
  });

  // Issues routes
  app.get("/api/issues", async (req, res) => {
    try {
      const issues = await storage.getIssues();
      res.json(issues);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch issues" });
    }
  });

  app.get("/api/issues/current", async (req, res) => {
    try {
      const currentIssue = await storage.getCurrentIssue();
      if (!currentIssue) {
        return res.status(404).json({ message: "No current issue found" });
      }
      res.json(currentIssue);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch current issue" });
    }
  });

  // Statistics route
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
