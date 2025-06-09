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

    // Seed actual journal issues from attached assets
    const actualIssues = [
      {
        volume: "16",
        issue: "2",
        title: "Current Trends in Cognitive Neuroscience",
        publishedAt: new Date("2024-10-01"),
        current: true,
        description: "The latest research in cognitive neuroscience, featuring breakthrough studies in neural plasticity and memory formation.",
        pdfUrl: "/attached_assets/Issues/16_2_print_edition.pdf",
        pdfSize: "3.2 MB"
      },
      {
        volume: "16",
        issue: "1", 
        title: "Advances in Neuroimaging and Brain Connectivity",
        publishedAt: new Date("2024-04-15"),
        current: false,
        description: "Exploring new methodologies in brain imaging and network analysis techniques.",
        pdfUrl: "/attached_assets/Issues/16_1_print_edition.pdf",
        pdfSize: "2.8 MB"
      },
      {
        volume: "15",
        issue: "2",
        title: "Methodological Innovations in Neuroscience Research",
        publishedAt: new Date("2023-11-20"),
        current: false,
        description: "Highlighting new methodological approaches that are revolutionizing neuroscience research.",
        pdfUrl: "/attached_assets/Issues/15_2.pdf",
        pdfSize: "2.5 MB"
      },
      {
        volume: "15",
        issue: "1",
        title: "Neural Mechanisms of Learning and Memory",
        publishedAt: new Date("2023-06-15"),
        current: false,
        description: "Comprehensive studies on learning processes and memory consolidation in the brain.",
        pdfUrl: "/attached_assets/Issues/15_1_final.pdf",
        pdfSize: "3.1 MB"
      },
      {
        volume: "14",
        issue: "2",
        title: "Clinical Applications of Cognitive Neuroscience",
        publishedAt: new Date("2022-12-01"),
        current: false,
        description: "Bridging the gap between basic research and clinical applications in neuroscience.",
        pdfUrl: "/attached_assets/Issues/14_2_update_2_1.pdf",
        pdfSize: "2.7 MB"
      },
      {
        volume: "14",
        issue: "1",
        title: "Computational Approaches to Brain Function",
        publishedAt: new Date("2022-06-20"),
        current: false,
        description: "Exploring computational models and their applications in understanding brain function.",
        pdfUrl: "/attached_assets/Issues/cns_journal_14_1.pdf",
        pdfSize: "2.9 MB"
      },
      {
        volume: "13",
        issue: "2",
        title: "Social Cognition and Brain Networks",
        publishedAt: new Date("2021-11-15"),
        current: false,
        description: "Investigating the neural basis of social cognition and interpersonal behavior.",
        pdfUrl: "/attached_assets/Issues/cns_journal_vol13_iss2_2.pdf",
        pdfSize: "2.4 MB"
      },
      {
        volume: "13",
        issue: "1",
        title: "Developmental Neuroscience Perspectives",
        publishedAt: new Date("2021-05-10"),
        current: false,
        description: "Understanding brain development and plasticity across the lifespan.",
        pdfUrl: "/attached_assets/Issues/cns_journal_vol13_issue12.pdf",
        pdfSize: "2.6 MB"
      },
      {
        volume: "12",
        issue: "2",
        title: "Cognitive Control and Executive Function",
        publishedAt: new Date("2020-12-08"),
        current: false,
        description: "Research on cognitive control mechanisms and executive function networks.",
        pdfUrl: "/attached_assets/Issues/cns_journal_vol12_issue2.pdf",
        pdfSize: "2.8 MB"
      },
      {
        volume: "11",
        issue: "2",
        title: "Attention and Perception in the Brain",
        publishedAt: new Date("2020-07-19"),
        current: false,
        description: "Studies on attentional mechanisms and perceptual processing in neural networks.",
        pdfUrl: "/attached_assets/Issues/cnsjournal_vol11_iss2_20160719_compressed.pdf",
        pdfSize: "2.2 MB"
      },
      {
        volume: "11",
        issue: "1",
        title: "Language and Communication Networks",
        publishedAt: new Date("2020-03-15"),
        current: false,
        description: "Exploring the neural basis of language processing and communication.",
        pdfUrl: "/attached_assets/Issues/cns_journal_vol11_iss1_final_compressed.pdf",
        pdfSize: "2.3 MB"
      },
      {
        volume: "10",
        issue: "1",
        title: "Emotion and Cognition Interactions",
        publishedAt: new Date("2019-08-25"),
        current: false,
        description: "Understanding the interplay between emotional and cognitive processes.",
        pdfUrl: "/attached_assets/Issues/cns_journal_vol10_issue1_compressed.pdf",
        pdfSize: "2.1 MB"
      },
      {
        volume: "9",
        issue: "1",
        title: "Motor Control and Action Understanding",
        publishedAt: new Date("2018-11-12"),
        current: false,
        description: "Research on motor control systems and action perception mechanisms.",
        pdfUrl: "/attached_assets/Issues/9_1_compressed.pdf",
        pdfSize: "1.9 MB"
      },
      {
        volume: "8",
        issue: "2",
        title: "Decision Making and Risk Assessment",
        publishedAt: new Date("2018-05-30"),
        current: false,
        description: "Neural mechanisms underlying decision-making processes and risk evaluation.",
        pdfUrl: "/attached_assets/Issues/volume_8_-_issue_2.pdf",
        pdfSize: "2.4 MB"
      },
      {
        volume: "8",
        issue: "1",
        title: "Memory Systems and Neural Plasticity",
        publishedAt: new Date("2017-12-20"),
        current: false,
        description: "Comprehensive analysis of memory systems and plasticity mechanisms.",
        pdfUrl: "/attached_assets/Issues/vol8iss1.pdf",
        pdfSize: "2.6 MB"
      },
      {
        volume: "7",
        issue: "2",
        title: "Consciousness and Awareness Studies",
        publishedAt: new Date("2017-07-15"),
        current: false,
        description: "Investigating the neural correlates of consciousness and awareness.",
        pdfUrl: "/attached_assets/Issues/vol7_iss2_withcover.pdf",
        pdfSize: "2.3 MB"
      },
      {
        volume: "7",
        issue: "1",
        title: "Brain Imaging Methodologies",
        publishedAt: new Date("2017-02-28"),
        current: false,
        description: "Advances in brain imaging techniques and analysis methods.",
        pdfUrl: "/attached_assets/Issues/vol7iss1.pdf",
        pdfSize: "2.7 MB"
      },
      {
        volume: "6",
        issue: "2",
        title: "Cognitive Development and Aging",
        publishedAt: new Date("2016-10-18"),
        current: false,
        description: "Studies on cognitive changes across development and aging processes.",
        pdfUrl: "/attached_assets/Issues/fulltext_vol6_iss2_pdf.pdf",
        pdfSize: "2.1 MB"
      },
      {
        volume: "6",
        issue: "1",
        title: "Neural Networks and Information Processing",
        publishedAt: new Date("2016-04-22"),
        current: false,
        description: "Understanding information processing in neural network architectures.",
        pdfUrl: "/attached_assets/Issues/fulltext_vol6_iss1.pdf",
        pdfSize: "2.0 MB"
      }
    ];

    actualIssues.forEach(issueData => {
      const id = this.currentId++;
      this.issues.set(id, { 
        ...issueData, 
        id
      });
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
