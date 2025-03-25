"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface RegistrationData {
  full_name: string;
  email: string;
  university: string;
  skills: string[];
  terms_accepted: boolean;
}

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    full_name: '',
    email: '',
    university: '',
    skills: [],
    terms_accepted: false
  });
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('registrations')
        .insert([
          {
            full_name: formData.full_name,
            email: formData.email,
            university: formData.university,
            skills: formData.skills,
            terms_accepted: formData.terms_accepted,
            registered_at: new Date().toISOString()
          }
        ]);
        
      if (error) throw error;
      
      alert("Registration successful!");
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        university: '',
        skills: [],
        terms_accepted: false
      });
    } catch (error) {
      alert("Error submitting registration. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSkillsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({ ...prev, skills: selectedOptions }));
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-card rounded-xl shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Register for HackXperience 2025</h2>
        <p className="text-muted-foreground mt-2">Join the ultimate hackathon experience</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.full_name}
            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
            className={cn(
              "w-full px-3 py-2 border rounded-md",
              "bg-background border-input",
              "focus:outline-none focus:ring-2 focus:ring-primary"
            )}
            placeholder="John Doe"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={cn(
              "w-full px-3 py-2 border rounded-md",
              "bg-background border-input",
              "focus:outline-none focus:ring-2 focus:ring-primary"
            )}
            placeholder="you@example.com"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="university" className="text-sm font-medium">
            University/Organization
          </label>
          <input
            id="university"
            type="text"
            required
            value={formData.university}
            onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
            className={cn(
              "w-full px-3 py-2 border rounded-md",
              "bg-background border-input",
              "focus:outline-none focus:ring-2 focus:ring-primary"
            )}
            placeholder="Stanford University"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="skills" className="text-sm font-medium">
            Skills
          </label>
          <select
            id="skills"
            multiple
            value={formData.skills}
            onChange={handleSkillsChange}
            className={cn(
              "w-full px-3 py-2 border rounded-md",
              "bg-background border-input",
              "focus:outline-none focus:ring-2 focus:ring-primary"
            )}
          >
            <option value="frontend">Frontend Development</option>
            <option value="backend">Backend Development</option>
            <option value="ml">Machine Learning</option>
            <option value="design">UI/UX Design</option>
            <option value="blockchain">Blockchain</option>
          </select>
          <p className="text-xs text-muted-foreground">Hold Ctrl/Cmd to select multiple</p>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            id="terms"
            type="checkbox"
            required
            checked={formData.terms_accepted}
            onChange={(e) => setFormData(prev => ({ ...prev, terms_accepted: e.target.checked }))}
            className="h-4 w-4 rounded border-input"
          />
          <label htmlFor="terms" className="text-sm">
            I agree to the <a href="#" className="text-primary hover:underline">Terms & Conditions</a>
          </label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full px-4 py-2 rounded-md font-medium",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-colors",
            "disabled:opacity-50 disabled:pointer-events-none"
          )}
        >
          {loading ? "Registering..." : "Register Now"}
        </button>
      </form>
    </div>
  );
} 