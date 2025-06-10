import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/page-transition";
import DynamicParticles from "@/components/dynamic-particles";
import StarlinkHeader from "@/components/starlink-header";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import About from "@/pages/about";
import CurrentIssue from "@/pages/current-issue";
import Archive from "@/pages/archive";
import ForAuthors from "@/pages/for-authors";
import ForReviewers from "@/pages/for-reviewers";
import Contact from "@/pages/contact";
import RequestIssue from "@/pages/request-issue";
import Article from "@/pages/article";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Dynamic particle background */}
      <DynamicParticles density={20} speed={0.2} />
      
      <StarlinkHeader />
      <main className="flex-1 relative z-10">
        <PageTransition>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/current-issue" component={CurrentIssue} />
            <Route path="/archive" component={Archive} />
            <Route path="/for-authors" component={ForAuthors} />
            <Route path="/for-reviewers" component={ForReviewers} />
            <Route path="/contact" component={Contact} />
            <Route path="/request-issue" component={RequestIssue} />
            <Route path="/article/:id" component={Article} />
            <Route component={NotFound} />
          </Switch>
        </PageTransition>
      </main>
      <Footer />
    </div>
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
