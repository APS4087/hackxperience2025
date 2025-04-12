"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { MorphingText } from "@/components/magicui/morphing-text";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BorderBeam } from "@/components/magicui/border-beam";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { Footer } from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Loading state component for any lazy-loaded sections
function LoadingState() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className={`w-full min-h-[300px] ${prefersReducedMotion ? 'bg-muted/20' : 'animate-pulse bg-muted/20'} rounded-lg`}>
      <div className="container mx-auto px-4 py-16">
        <div className={`h-8 w-48 bg-muted/40 rounded mb-8 ${!prefersReducedMotion && 'animate-pulse'}`} />
        <div className="space-y-4">
          <div className={`h-4 w-full bg-muted/40 rounded ${!prefersReducedMotion && 'animate-pulse'}`} />
          <div className={`h-4 w-3/4 bg-muted/40 rounded ${!prefersReducedMotion && 'animate-pulse'}`} />
        </div>
      </div>
    </div>
  );
}

// Project submission form component
function ProjectSubmissionForm() {
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [presentationMethod, setPresentationMethod] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    projectTitle: '',
    teamName: '',
    teamMembers: '',
    problemStatement: '',
    demoVideoUrl: '',
    repoUrl: '',
    presentationUrl: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.projectTitle.trim()) {
      newErrors.projectTitle = "Project title is required";
      isValid = false;
    }

    if (!formData.teamName.trim()) {
      newErrors.teamName = "Team name is required";
      isValid = false;
    }

    if (!formData.teamMembers.trim()) {
      newErrors.teamMembers = "Team members information is required";
      isValid = false;
    }

    if (!formData.problemStatement) {
      newErrors.problemStatement = "Problem statement is required";
      isValid = false;
    }

    if (!formData.demoVideoUrl.trim()) {
      newErrors.demoVideoUrl = "Demo video URL is required";
      isValid = false;
    } else if (!/^https?:\/\//.test(formData.demoVideoUrl)) {
      newErrors.demoVideoUrl = "Please enter a valid URL";
      isValid = false;
    }

    if (!formData.repoUrl.trim()) {
      newErrors.repoUrl = "GitHub repository URL is required";
      isValid = false;
    } else if (!/^https?:\/\//.test(formData.repoUrl)) {
      newErrors.repoUrl = "Please enter a valid URL";
      isValid = false;
    }
    
    // Validate presentation based on the selected method
    if (presentationMethod === 'url') {
      if (!formData.presentationUrl.trim()) {
        newErrors.presentationUrl = "Presentation URL is required";
        isValid = false;
      } else if (!/^https?:\/\//.test(formData.presentationUrl)) {
        newErrors.presentationUrl = "Please enter a valid URL";
        isValid = false;
      }
    } else if (presentationMethod === 'file') {
      if (!selectedFile) {
        newErrors.presentationFile = "Presentation file is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      let presentationUrl = formData.presentationUrl;
      
      // If user chose file upload and has selected a file, upload it
      if (presentationMethod === 'file' && selectedFile) {
        presentationUrl = await uploadPresentationFile(selectedFile);
      }
      
      // Send the data to Supabase
      const { error } = await supabase
        .from('project_submissions')
        .insert([
          {
            project_title: formData.projectTitle,
            team_name: formData.teamName,
            team_members: formData.teamMembers,
            problem_statement: formData.problemStatement,
            demo_video_url: formData.demoVideoUrl,
            repo_url: formData.repoUrl,
            presentation_url: presentationUrl,
            submitted_at: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
      
      // Reset form after successful submission
      setFormData({
        projectTitle: '',
        teamName: '',
        teamMembers: '',
        problemStatement: '',
        demoVideoUrl: '',
        repoUrl: '',
        presentationUrl: ''
      });
      
      // Reset file input and state
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setPresentationMethod('url');
      
      // Show success messages
      showToast.success("Project submitted successfully!");
      setTimeout(() => {
        showToast.success("Thank you for your submission!");
      }, 1000);
    } catch (error) {
      console.error("Error submitting project:", error);
      
      // Handle different types of errors
      if (error instanceof Error) {
        showToast.error(error.message);
      } else if (typeof error === 'object' && error !== null && 'code' in error) {
        // Handle specific database errors
        const dbError = error as { code: string; message: string; details?: string };
        switch (dbError.code) {
          case '23505': // Unique constraint violation
            if (dbError.details?.includes('team_name')) {
              showToast.error("This team has already submitted a project. Please contact the organizers if you need to update your submission.");
            } else {
              showToast.error("A submission with this information already exists.");
            }
            break;
          default:
            showToast.error("Error submitting project. Please try again later.");
        }
      } else {
        showToast.error("Error submitting project. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check if file is a valid presentation file (ppt, pptx)
      if (file.type === 'application/vnd.ms-powerpoint' || 
          file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
          file.name.endsWith('.ppt') || 
          file.name.endsWith('.pptx')) {
        setSelectedFile(file);
        // Clear any previous errors
        if (errors.presentationUrl) {
          setErrors(prev => ({ ...prev, presentationUrl: "" }));
        }
      } else {
        setErrors(prev => ({ 
          ...prev, 
          presentationFile: "Please upload a valid PowerPoint file (.ppt or .pptx)" 
        }));
        setSelectedFile(null);
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const uploadPresentationFile = async (file: File) => {
    try {
      setUploadingFile(true);
      
      // Create a unique file name to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${formData.teamName.replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;
      const filePath = `presentations/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('hackathon-files')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('hackathon-files')
        .getPublicUrl(filePath);
        
      return publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    } finally {
      setUploadingFile(false);
    }
  };

  return (
    <Card className="relative border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <BorderBeam duration={20} />
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl text-center">Submit Your Project</CardTitle>
        <CardDescription className="text-center">
          Share your innovative solution with the HackXperience community
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="projectTitle">Project Title</Label>
              <Input
                id="projectTitle"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleChange}
                placeholder="your project title"
                className={errors.projectTitle ? "border-red-500" : ""}
              />
              {errors.projectTitle && (
                <p className="text-sm text-red-500">{errors.projectTitle}</p>
              )}
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                placeholder="your team name"
                className={errors.teamName ? "border-red-500" : ""}
              />
              {errors.teamName && (
                <p className="text-sm text-red-500">{errors.teamName}</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="teamMembers">Names of Team Members</Label>
            <textarea
              id="teamMembers"
              name="teamMembers"
              value={formData.teamMembers}
              onChange={handleChange}
              placeholder="List the full names of all team members (e.g. Liz, Albert, etc.)"
              rows={3}
              className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.teamMembers ? "border-red-500" : ""}`}
            />
            {errors.teamMembers && (
              <p className="text-sm text-red-500">{errors.teamMembers}</p>
            )}
          </div>
          
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="problemStatement">Problem Statement Chosen</Label>
            <Select
              value={formData.problemStatement}
              onValueChange={(value) => handleSelectChange('problemStatement', value)}
            >
              <SelectTrigger id="problemStatement" className={errors.problemStatement ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a problem statement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dynamic Web">Dynamic Web</SelectItem>
                <SelectItem value="Kitchen Copilot">Kitchen Copilot</SelectItem>
              </SelectContent>
            </Select>
            {errors.problemStatement && (
              <p className="text-sm text-red-500">{errors.problemStatement}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="demoVideoUrl">Demo Video URL</Label>
              <Input
                id="demoVideoUrl"
                name="demoVideoUrl"
                type="url"
                value={formData.demoVideoUrl}
                onChange={handleChange}
                placeholder="YouTube or Google Drive link"
                className={errors.demoVideoUrl ? "border-red-500" : ""}
              />
              {errors.demoVideoUrl && (
                <p className="text-sm text-red-500">{errors.demoVideoUrl}</p>
              )}
              <p className="text-xs text-muted-foreground">Enter YouTube or Google Drive URL for your demo video</p>
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="repoUrl">GitHub Repository URL</Label>
              <Input
                id="repoUrl"
                name="repoUrl"
                type="url"
                value={formData.repoUrl}
                onChange={handleChange}
                placeholder="https://github.com/your-repo"
                className={errors.repoUrl ? "border-red-500" : ""}
              />
              {errors.repoUrl && (
                <p className="text-sm text-red-500">{errors.repoUrl}</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col space-y-1.5">
            <Label>Presentation (Choose one of the following options)</Label>
            <Tabs value={presentationMethod} onValueChange={(v) => setPresentationMethod(v as 'url' | 'file')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="url">Provide URL</TabsTrigger>
                <TabsTrigger value="file">Upload File</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url" className="mt-0">
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="presentationUrl"
                    name="presentationUrl"
                    type="url"
                    value={formData.presentationUrl}
                    onChange={handleChange}
                    placeholder="Google Slides or Canva presentation link"
                    className={errors.presentationUrl ? "border-red-500" : ""}
                  />
                  {errors.presentationUrl && (
                    <p className="text-sm text-red-500">{errors.presentationUrl}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Enter a link to your Google Slides or Canva presentation</p>
                </div>
              </TabsContent>
              
              <TabsContent value="file" className="mt-0">
                <div className="flex flex-col space-y-1.5">
                  <Input
                    ref={fileInputRef}
                    id="presentationFile"
                    name="presentationFile"
                    type="file"
                    onChange={handleFileChange}
                    accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    className={errors.presentationFile ? "border-red-500" : ""}
                  />
                  {errors.presentationFile && (
                    <p className="text-sm text-red-500">{errors.presentationFile}</p>
                  )}
                  {selectedFile && (
                    <p className="text-xs text-green-500">Selected: {selectedFile.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Upload a PowerPoint file (.ppt or .pptx)</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{uploadingFile ? "Uploading file..." : "Submitting..."}</span>
                </div>
              ) : "Submit Project"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const morphingWords = [
  "Innovate", 
  "Create", 
  "Build", 
  "Design", 
  "Develop",
  "Showcase",
  "Present"
];

export default function SubmitPage() {
  // Initialize smooth scrolling
  useSmoothScroll();
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <main className="flex-1 relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -z-10 w-[50vw] h-[50vh] bg-gradient-to-b from-purple-500/10 to-red-500/5 blur-[120px] rounded-full transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 -z-10 w-[40vw] h-[40vh] bg-gradient-to-t from-blue-500/10 to-teal-500/5 blur-[100px] rounded-full transform -translate-x-1/3 translate-y-1/3" />
        
        {/* Floating particles */}
        <div 
          className="fixed inset-0 -z-10 opacity-50"
          style={{
            background: `radial-gradient(4px 4px at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.2), transparent 50%)`,
            maskImage: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, transparent, black 80%)`,
          }}
        />
        
        {/* Header section */}
        <section className="py-12 sm:py-24 bg-background overflow-hidden">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
                Back to Home
              </Link>
              
              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6"
                style={{
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundSize: "300% 100%",
                  backgroundImage: "linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 25%, #ef4444 50%, #e2e8f0 75%, #f1f5f9 100%)",
                  filter: "drop-shadow(0 0 20px rgba(226,232,240,0.2))"
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <span className="inline-block">
                  <MorphingText texts={morphingWords} />
                </span>{" "}
                & Submit
              </motion.h1>
              
              <motion.p 
                className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Showcase your groundbreaking project developed during HackXperience 2025. 
                Upload your submission details and let your innovation shine.
              </motion.p>
            </div>
          </div>
        </section>
        
        {/* Main content section */}
        <section className="py-12 pb-24 sm:pb-32 relative">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto">
              <Suspense fallback={<LoadingState />}>
                <ProjectSubmissionForm />
              </Suspense>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
} 