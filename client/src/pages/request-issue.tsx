import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, RefreshCw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const requestFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  issueType: z.enum(["digital", "printed"], {
    required_error: "Please select an issue type",
  }),
  issueNumber: z.string().min(1, "Issue number/article title is required"),
  affiliation: z.string().min(1, "Affiliation is required"),
  howDidYouLearn: z.string().optional(),
  captcha: z.string().min(1, "Please complete the CAPTCHA"),
});

type RequestFormData = z.infer<typeof requestFormSchema>;

const issueNumbers = [
  "Issue 18 - Complete Edition",
  "Functional Connectivity Between Language-Related Areas - Merel Koning",
  "Task-Dependent Movement Variability in Gait Control - Mathilde Sijtsma", 
  "Disentangling the Neuromodulatory Effects of Transcranial Ultrasonic Stimulation - Solenn L. Y. Walstra",
  "Default Mode Network Functional Connectivity in the Postictal State - Tijn Stolk",
  "Super-Resolution Imaging of Presynaptic Actin - Channa Elise Jakobs",
  "A Biologically plausible Phosphene Simulator - Maureen van der Grinten",
  "Exploring GAN Latent Spaces: Image Reconstruction from Brain Activity - Ruoshi Zheng"
];

export default function RequestIssue() {
  const [captchaText, setCaptchaText] = useState("VERIFY");
  const [captchaAnswer, setCaptchaAnswer] = useState("VERIFY");
  const { toast } = useToast();

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      zipCode: "",
      city: "",
      country: "",
      issueNumber: "",
      affiliation: "",
      howDidYouLearn: "",
      captcha: "",
    },
  });

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setCaptchaAnswer(result);
  };

  const requestMutation = useMutation({
    mutationFn: async (data: RequestFormData) => {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to submit request");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request submitted successfully",
        description: "We'll process your request and get back to you soon.",
      });
      form.reset();
      generateCaptcha();
    },
    onError: (error) => {
      toast({
        title: "Error submitting request",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: RequestFormData) => {
    if (data.captcha !== captchaAnswer) {
      form.setError("captcha", { message: "CAPTCHA verification failed" });
      return;
    }
    requestMutation.mutate(data);
  };

  const issue18Articles = [
    {
      title: "Functional Connectivity Between Language-Related Areas and Its Relations with Age, L2 Proficiency, and Grammar Learning Ability",
      author: "Merel Koning",
      size: "25 MB"
    },
    {
      title: "Task-Dependent Movement Variability in Gait Control: A Computational Account",
      author: "Mathilde Sijtsma", 
      size: "23 MB"
    },
    {
      title: "Disentangling the Neuromodulatory Effects of Transcranial Ultrasonic Stimulation of the Frontal Eye Fields in Humans",
      author: "Solenn L. Y. Walstra",
      size: "36 MB"
    },
    {
      title: "Default Mode Network Functional Connectivity in the Postictal State after Electroconvulsive Therapy",
      author: "Tijn Stolk",
      size: "25 MB"
    },
    {
      title: "Super-Resolution Imaging of Presynaptic Actin: Distinct Actin Nanostructures in Bead-Induced and Natural Presynapses",
      author: "Channa Elise Jakobs",
      size: "23 MB"
    },
    {
      title: "A Biologically plausible Phosphene Simulator for the Optimization of Visual Cortical Prostheses",
      author: "Maureen van der Grinten",
      size: "1.4 MB"
    },
    {
      title: "Exploring GAN Latent Spaces: Image Reconstruction from Brain Activity Without Ground Truths",
      author: "Ruoshi Zheng",
      size: "35 MB"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50/30 to-red-100/20 dark:from-black dark:via-red-950/20 dark:to-red-900/10">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Request Your Issue
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Please fill out the form below.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Fields marked with <span className="text-red-500">*</span> are mandatory.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request Form */}
          <Card className="bg-white/80 dark:bg-black/40 backdrop-blur-sm border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                Request Form
              </CardTitle>
              <CardDescription>
                Complete the form to request a printed or digital copy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Uw gegevens (Your Details)
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Issue Details
                    </h3>

                    <FormField
                      control={form.control}
                      name="issueType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select issue type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="digital">Digital Edition</SelectItem>
                              <SelectItem value="printed">Printed Edition</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="issueNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue number / article title *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an issue or article" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {issueNumbers.map((issue) => (
                                <SelectItem key={issue} value={issue}>
                                  {issue}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="affiliation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Affiliation *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Your institution or organization" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="howDidYouLearn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How did you learn about us?</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="min-h-[80px]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="captcha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CAPTCHA *</FormLabel>
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded border font-mono text-lg tracking-widest">
                              {captchaText}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={generateCaptcha}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Enter the characters above"
                              className="mt-2"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                    disabled={requestMutation.isPending}
                  >
                    {requestMutation.isPending ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Issue 18 Downloads */}
          <Card className="bg-white/80 dark:bg-black/40 backdrop-blur-sm border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                Print Edition - Issue 18
              </CardTitle>
              <CardDescription>
                You can download the PDF file of all theses of Journal Issue 18 below. Due to the large number of accepted theses for this edition, the full PDF of the journal can be requested at{" "}
                <a 
                  href="mailto:nijmegencns@gmail.com" 
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  nijmegencns@gmail.com
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {issue18Articles.map((article, index) => (
                  <div 
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 leading-tight">
                      {article.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {article.author}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Print Version (pdf, {article.size})
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}