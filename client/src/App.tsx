import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/page-transition";
import DynamicParticles from "@/components/dynamic-particles";
import Header from "@/components/header";
import Footer from "@/components/footer";

import Welcome2 from "@/pages/welcome2";
import BrainDemo from "@/pages/brain-demo";
import DustPhysicsDemo from "@/pages/dust-physics-demo";
import Home from "@/pages/home";
import About from "@/pages/about";
import CurrentIssue from "@/pages/current-issue";
import Archive from "@/pages/archive";
import ForAuthors from "@/pages/for-authors";
import ForReviewers from "@/pages/for-reviewers";
import Contact from "@/pages/contact";
import Article from "@/pages/article";
import NotFound from "@/pages/not-found";

// Layout wrapper for journal pages
function JournalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <DynamicParticles density={20} speed={0.2} />
      <Header />
      <main className="flex-1 relative z-10">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Welcome page - default route with lightning and smoke background */}
      <Route path="/" component={Welcome2} />
      
      {/* Brain demo page - just the brain visualization */}
      <Route path="/brain-demo" component={BrainDemo} />
      
      {/* Dust physics simulator demo */}
      <Route path="/dust-physics-demo" component={DustPhysicsDemo} />
      
      {/* Main journal pages with header/footer */}
      <Route path="/home" component={() => <JournalLayout><Home /></JournalLayout>} />
      <Route path="/about" component={() => <JournalLayout><About /></JournalLayout>} />
      <Route path="/current-issue" component={() => <JournalLayout><CurrentIssue /></JournalLayout>} />
      <Route path="/archive" component={() => <JournalLayout><Archive /></JournalLayout>} />
      <Route path="/for-authors" component={() => <JournalLayout><ForAuthors /></JournalLayout>} />
      <Route path="/for-reviewers" component={() => <JournalLayout><ForReviewers /></JournalLayout>} />
      <Route path="/contact" component={() => <JournalLayout><Contact /></JournalLayout>} />
      <Route path="/article/:id" component={() => <JournalLayout><Article /></JournalLayout>} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
