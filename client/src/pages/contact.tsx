import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, Clock, Send, User, MessageSquare } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you within 2 business days.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-maroon mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our editorial team for questions about submissions, reviews, or general inquiries.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-maroon flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Editorial Office
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">General Inquiries</Label>
                  <a 
                    href="mailto:editor@snj.ru.nl" 
                    className="block text-poppy hover:text-red-600 transition-colors"
                  >
                    editor@snj.ru.nl
                  </a>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Submissions</Label>
                  <a 
                    href="mailto:submissions@snj.ru.nl" 
                    className="block text-poppy hover:text-red-600 transition-colors"
                  >
                    submissions@snj.ru.nl
                  </a>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Review Process</Label>
                  <a 
                    href="mailto:reviews@snj.ru.nl" 
                    className="block text-poppy hover:text-red-600 transition-colors"
                  >
                    reviews@snj.ru.nl
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-maroon flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-600">
                  <p className="font-medium">Radboud University</p>
                  <p>Faculty of Social Sciences</p>
                  <p>Donders Institute for Brain, Cognition and Behaviour</p>
                  <p>Heyendaalseweg 135</p>
                  <p>6525 AJ Nijmegen</p>
                  <p>The Netherlands</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-maroon flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">General Inquiries</span>
                  <span className="text-poppy font-medium">2-3 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Submission Questions</span>
                  <span className="text-poppy font-medium">1-2 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Review Updates</span>
                  <span className="text-poppy font-medium">Within 24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Technical Support</span>
                  <span className="text-poppy font-medium">Same business day</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-maroon flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select inquiry type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="submission">Manuscript Submission</SelectItem>
                              <SelectItem value="review">Review Process</SelectItem>
                              <SelectItem value="editorial">Editorial Board</SelectItem>
                              <SelectItem value="technical">Technical Support</SelectItem>
                              <SelectItem value="general">General Inquiry</SelectItem>
                              <SelectItem value="collaboration">Collaboration</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Brief description of your inquiry" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please provide details about your inquiry..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-poppy hover:bg-red-600 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Editorial Team */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-maroon mb-8 text-center">Direct Contact</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-poppy rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-white h-8 w-8" />
                </div>
                <h3 className="font-bold text-maroon mb-2">Dr. Emma Verschoor</h3>
                <p className="text-ladybug text-sm font-medium mb-3">Editor-in-Chief</p>
                <p className="text-gray-600 text-sm mb-4">
                  Manuscript evaluation, editorial decisions, journal policy
                </p>
                <a 
                  href="mailto:e.verschoor@ru.nl"
                  className="inline-flex items-center space-x-1 text-poppy hover:text-red-600 text-sm"
                >
                  <Mail className="h-4 w-4" />
                  <span>e.verschoor@ru.nl</span>
                </a>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-ladybug rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-white h-8 w-8" />
                </div>
                <h3 className="font-bold text-maroon mb-2">Dr. Jan Peters</h3>
                <p className="text-ladybug text-sm font-medium mb-3">Associate Editor</p>
                <p className="text-gray-600 text-sm mb-4">
                  Peer review coordination, reviewer assignments
                </p>
                <a 
                  href="mailto:j.peters@ru.nl"
                  className="inline-flex items-center space-x-1 text-poppy hover:text-red-600 text-sm"
                >
                  <Mail className="h-4 w-4" />
                  <span>j.peters@ru.nl</span>
                </a>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-berry rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-white h-8 w-8" />
                </div>
                <h3 className="font-bold text-maroon mb-2">Dr. Sarah Ahmed</h3>
                <p className="text-ladybug text-sm font-medium mb-3">Managing Editor</p>
                <p className="text-gray-600 text-sm mb-4">
                  Submission processing, author communications
                </p>
                <a 
                  href="mailto:s.ahmed@ru.nl"
                  className="inline-flex items-center space-x-1 text-poppy hover:text-red-600 text-sm"
                >
                  <Mail className="h-4 w-4" />
                  <span>s.ahmed@ru.nl</span>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white p-8 rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-maroon mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-maroon mb-3">How do I submit an article?</h3>
              <p className="text-gray-600 text-sm mb-6">
                Visit our "For Authors" page for detailed submission guidelines and use our online submission portal.
              </p>

              <h3 className="font-semibold text-maroon mb-3">What is the review timeline?</h3>
              <p className="text-gray-600 text-sm mb-6">
                The typical review process takes 8-13 weeks from submission to final decision.
              </p>

              <h3 className="font-semibold text-maroon mb-3">Can I track my submission?</h3>
              <p className="text-gray-600 text-sm">
                Yes, you'll receive regular updates via email about your submission status.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-maroon mb-3">Who can submit to the journal?</h3>
              <p className="text-gray-600 text-sm mb-6">
                Currently enrolled students at Radboud University in any neuroscience-related program.
              </p>

              <h3 className="font-semibold text-maroon mb-3">Is the journal open access?</h3>
              <p className="text-gray-600 text-sm mb-6">
                Yes, all published articles are freely accessible to readers worldwide.
              </p>

              <h3 className="font-semibold text-maroon mb-3">How can I become a reviewer?</h3>
              <p className="text-gray-600 text-sm">
                Visit our "For Reviewers" page and fill out the reviewer application form.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
