import { users, articles, editors, issues, type User, type InsertUser, type Article, type InsertArticle, type Editor, type InsertEditor, type Issue, type InsertIssue } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Articles
  getArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  getFeaturedArticles(): Promise<Article[]>;
  getPublishedArticles(): Promise<Article[]>;
  getArticlesByCategory(category: string): Promise<Article[]>;
  searchArticles(query: string): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  
  // Editors
  getEditors(): Promise<Editor[]>;
  createEditor(editor: InsertEditor): Promise<Editor>;
  
  // Issues
  getIssues(): Promise<Issue[]>;
  getCurrentIssue(): Promise<Issue | undefined>;
  createIssue(issue: InsertIssue): Promise<Issue>;
  
  // Statistics
  getStats(): Promise<{
    publishedArticles: number;
    authors: number;
    monthlyReaders: number;
    totalCitations: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private articles: Map<number, Article>;
  private editors: Map<number, Editor>;
  private issues: Map<number, Issue>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.editors = new Map();
    this.issues = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Seed editors
    const sampleEditors: Omit<Editor, 'id'>[] = [
      {
        name: "Dr. Emma Verschoor",
        title: "Editor-in-Chief",
        specialization: "Cognitive Neuroscience",
        email: "e.verschoor@ru.nl",
        imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        bio: "Leading researcher in cognitive neuroscience with focus on memory and learning."
      },
      {
        name: "Dr. Jan Peters",
        title: "Associate Editor",
        specialization: "Computational Neuroscience",
        email: "j.peters@ru.nl",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        bio: "Expert in computational models of neural networks and brain simulation."
      },
      {
        name: "Dr. Sarah Ahmed",
        title: "Managing Editor",
        specialization: "Behavioral Neuroscience",
        email: "s.ahmed@ru.nl",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        bio: "Specialist in behavioral neuroscience and neural basis of behavior."
      }
    ];

    sampleEditors.forEach(editor => {
      const id = this.currentId++;
      this.editors.set(id, { ...editor, id });
    });

    // Seed current issue
    const currentIssue: Omit<Issue, 'id' | 'publishedAt'> = {
      volume: "3",
      issue: "2",
      title: "Exploring the frontiers of neuroscience through student-led research and innovative methodologies",
      description: "This issue focuses on cutting-edge research in neural plasticity, memory consolidation, and advanced imaging techniques.",
      current: true
    };
    
    const issueId = this.currentId++;
    this.issues.set(issueId, { 
      ...currentIssue, 
      id: issueId, 
      publishedAt: new Date('2024-10-15')
    });

    // Seed articles
    const sampleArticles: Omit<Article, 'id' | 'createdAt' | 'publishedAt'>[] = [
      {
        title: "Neural Plasticity in Learning: A Comprehensive Analysis of Synaptic Adaptation Mechanisms",
        abstract: "This study investigates the molecular mechanisms underlying synaptic plasticity during learning processes, utilizing advanced imaging techniques to observe real-time neural adaptations in hippocampal networks. Our findings reveal novel pathways involved in long-term potentiation and their implications for memory formation.",
        content: "Full article content would be here...",
        authors: ["Maria van der Berg", "Thomas Janssen"],
        keywords: ["neural plasticity", "synaptic adaptation", "learning", "hippocampus", "LTP"],
        category: "research",
        status: "published",
        issue: "2",
        volume: "3",
        featured: true,
        readTime: 15,
        imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        doi: "10.1234/snj.2024.3.2.001",
        citations: 12
      },
      {
        title: "Memory Consolidation During Sleep: EEG Analysis",
        abstract: "Investigating how sleep patterns affect memory consolidation through comprehensive EEG monitoring of students during different sleep phases.",
        content: "Full article content would be here...",
        authors: ["Sophie Chen"],
        keywords: ["memory consolidation", "sleep", "EEG", "circadian rhythm"],
        category: "research",
        status: "published",
        issue: "2",
        volume: "3",
        featured: false,
        readTime: 15,
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        doi: "10.1234/snj.2024.3.2.002",
        citations: 8
      },
      {
        title: "Neurotransmitter Dynamics in Depression",
        abstract: "A comprehensive review of serotonin and dopamine pathways in depressive disorders, analyzing recent findings in neurotransmitter research.",
        content: "Full article content would be here...",
        authors: ["Lucas Vermeer"],
        keywords: ["depression", "serotonin", "dopamine", "neurotransmitters"],
        category: "review",
        status: "published",
        issue: "2",
        volume: "3",
        featured: false,
        readTime: 12,
        imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        doi: "10.1234/snj.2024.3.2.003",
        citations: 15
      },
      {
        title: "Advanced fMRI Techniques for Neural Mapping",
        abstract: "Exploring novel functional magnetic resonance imaging protocols for high-resolution brain mapping and real-time neural activity monitoring.",
        content: "Full article content would be here...",
        authors: ["Anna Koopman"],
        keywords: ["fMRI", "brain mapping", "neural imaging", "methodology"],
        category: "methods",
        status: "published",
        issue: "2",
        volume: "3",
        featured: false,
        readTime: 8,
        imageUrl: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        doi: "10.1234/snj.2024.3.2.004",
        citations: 6
      }
    ];

    sampleArticles.forEach(article => {
      const id = this.currentId++;
      this.articles.set(id, { 
        ...article, 
        id, 
        createdAt: new Date('2024-10-01'),
        publishedAt: new Date('2024-10-15')
      });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }

  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getFeaturedArticles(): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(article => 
      article.featured && article.status === "published"
    );
  }

  async getPublishedArticles(): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(article => 
      article.status === "published"
    );
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(article => 
      article.category === category && article.status === "published"
    );
  }

  async searchArticles(query: string): Promise<Article[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.articles.values()).filter(article => 
      article.status === "published" && (
        article.title.toLowerCase().includes(lowerQuery) ||
        article.abstract.toLowerCase().includes(lowerQuery) ||
        article.authors.some(author => author.toLowerCase().includes(lowerQuery)) ||
        article.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
      )
    );
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentId++;
    const article: Article = { 
      ...insertArticle, 
      id, 
      createdAt: new Date(),
      publishedAt: insertArticle.status === "published" ? new Date() : null,
      citations: 0
    };
    this.articles.set(id, article);
    return article;
  }

  async getEditors(): Promise<Editor[]> {
    return Array.from(this.editors.values());
  }

  async createEditor(insertEditor: InsertEditor): Promise<Editor> {
    const id = this.currentId++;
    const editor: Editor = { ...insertEditor, id };
    this.editors.set(id, editor);
    return editor;
  }

  async getIssues(): Promise<Issue[]> {
    return Array.from(this.issues.values());
  }

  async getCurrentIssue(): Promise<Issue | undefined> {
    return Array.from(this.issues.values()).find(issue => issue.current);
  }

  async createIssue(insertIssue: InsertIssue): Promise<Issue> {
    const id = this.currentId++;
    const issue: Issue = { 
      ...insertIssue, 
      id, 
      publishedAt: new Date()
    };
    this.issues.set(id, issue);
    return issue;
  }

  async getStats(): Promise<{
    publishedArticles: number;
    authors: number;
    monthlyReaders: number;
    totalCitations: number;
  }> {
    const publishedArticles = Array.from(this.articles.values()).filter(
      article => article.status === "published"
    );
    
    const uniqueAuthors = new Set();
    publishedArticles.forEach(article => {
      article.authors.forEach(author => uniqueAuthors.add(author));
    });

    const totalCitations = publishedArticles.reduce(
      (sum, article) => sum + (article.citations || 0), 0
    );

    return {
      publishedArticles: publishedArticles.length,
      authors: uniqueAuthors.size,
      monthlyReaders: 15200, // Static for demo
      totalCitations
    };
  }
}

export const storage = new MemStorage();
