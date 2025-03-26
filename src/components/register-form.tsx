"use client";

import React, { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/magicui/border-beam";
import { showToast } from "@/lib/toast";

interface RegistrationData {
  full_name: string;
  email: string;
  sim_id: string;
  course_and_university: string;
  has_team: boolean;
  is_team_lead: boolean | null;
  team_lead_email: string | null;
  team_name: string | null;
}

interface FormErrors {
  full_name?: string;
  email?: string;
  sim_id?: string;
  course_and_university?: string;
  team_name?: string;
  team_lead_email?: string;
  is_team_lead?: string;
}

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<RegistrationData>({
    full_name: '',
    email: '',
    sim_id: '',
    course_and_university: '',
    has_team: false,
    is_team_lead: null,
    team_lead_email: null,
    team_name: null
  });

  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validateSIMID = (simId: string) => {
    // Assuming SIM ID should be 8 digits
    return /^\d{8}$/.test(simId);
  };
  
  const validateTeamLeadEmail = async (email: string) => {
    const { data, error } = await supabase
      .from('registrations')
      .select('id, is_team_lead')
      .eq('email', email)
      .single();

    if (error) {
      throw new Error('Error checking team lead email');
    }

    if (!data) {
      throw new Error('Team lead email not found in registrations');
    }

    if (!data.is_team_lead) {
      throw new Error('The provided email belongs to a team member, not a team lead');
    }

    return true;
  };

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Please enter your full name";
      isValid = false;
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!validateSIMID(formData.sim_id)) {
      newErrors.sim_id = "SIM ID must be 8 digits";
      isValid = false;
    }

    if (!formData.course_and_university.trim()) {
      newErrors.course_and_university = "Please enter your course and university";
      isValid = false;
    }

    if (formData.has_team) {
      if (formData.is_team_lead === null) {
        newErrors.is_team_lead = "Please select your role in the team";
        isValid = false;
      }

      if (!formData.team_name?.trim()) {
        newErrors.team_name = "Please enter your team name";
        isValid = false;
      }

      if (formData.is_team_lead === false && !formData.team_lead_email) {
        newErrors.team_lead_email = "Please enter your team lead's email";
        isValid = false;
      }

      if (formData.is_team_lead === false && formData.team_lead_email && !validateEmail(formData.team_lead_email)) {
        newErrors.team_lead_email = "Please enter a valid team lead email address";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [formData, validateEmail]);
  
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Check if email is already registered
      const { data: existingUser } = await supabase
        .from('registrations')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (existingUser) {
        setLoading(false);
        showToast.error("This email is already registered. Please use a different email address.");
        return;
      }

      // Check if SIM ID is already registered
      const { data: existingSIMID } = await supabase
        .from('registrations')
        .select('id')
        .eq('sim_id', formData.sim_id)
        .single();

      if (existingSIMID) {
        setLoading(false);
        showToast.error("This SIM ID is already registered. Please check your ID or contact support if you think this is an error.");
        return;
      }

      // Validate team lead email if user is a team member
      if (formData.has_team && !formData.is_team_lead && formData.team_lead_email) {
        try {
          await validateTeamLeadEmail(formData.team_lead_email);
        } catch (error) {
          setLoading(false);
          if (error instanceof Error) {
            showToast.error(error.message);
          } else {
            showToast.error("Error validating team lead email. Please try again.");
          }
          return;
        }
      }

      // Check if team name is already taken
      if (formData.has_team && formData.team_name) {
        const { data: existingTeam } = await supabase
          .from('registrations')
          .select('id')
          .eq('team_name', formData.team_name)
          .single();

        if (existingTeam) {
          setLoading(false);
          showToast.error("This team name is already taken. Please choose a different team name.");
          return;
        }
      }

      const { error: insertError } = await supabase
        .from('registrations')
        .insert([
          {
            full_name: formData.full_name,
            email: formData.email,
            sim_id: formData.sim_id,
            course_and_university: formData.course_and_university,
            has_team: formData.has_team,
            is_team_lead: formData.is_team_lead,
            team_lead_email: formData.team_lead_email,
            team_name: formData.team_name,
            registered_at: new Date().toISOString()
          }
        ]);
        
      if (insertError) throw insertError;
      
      showToast.success("Registration successful!");
      setTimeout(() => {
        showToast.success("Welcome to HackXperience 2025!");
      }, 1000);
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        sim_id: '',
        course_and_university: '',
        has_team: false,
        is_team_lead: null,
        team_lead_email: null,
        team_name: null
      });
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof Error) {
        showToast.error(error.message);
      } else if (typeof error === 'object' && error !== null && 'code' in error) {
        // Handle specific database errors
        const dbError = error as { code: string; message: string; details: string };
        switch (dbError.code) {
          case '23505': // Unique constraint violation
            if (dbError.details?.includes('sim_id')) {
              showToast.error("This SIM ID is already registered. Please check your ID or contact support if you think this is an error.");
            } else if (dbError.details?.includes('email')) {
              showToast.error("This email is already registered. Please use a different email address.");
            } else if (dbError.details?.includes('team_name')) {
              showToast.error("This team name is already taken. Please choose a different team name.");
            } else {
              showToast.error("A registration with this information already exists.");
            }
            break;
          default:
            showToast.error("Error submitting registration. Please try again.");
        }
      } else {
        showToast.error("Error submitting registration. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [validateForm, formData]);

  const handleFieldValidation = (field: keyof RegistrationData, value: string) => {
    const newErrors: FormErrors = { ...errors };
    
    switch (field) {
      case 'full_name':
        if (!value.trim()) {
          newErrors.full_name = "Please enter your full name";
        } else {
          delete newErrors.full_name;
        }
        break;
      case 'email':
        if (!validateEmail(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
      case 'sim_id':
        if (!validateSIMID(value)) {
          newErrors.sim_id = "SIM ID must be 8 digits";
        } else {
          delete newErrors.sim_id;
        }
        break;
      case 'course_and_university':
        if (!value.trim()) {
          newErrors.course_and_university = "Please enter your course and university";
        } else {
          delete newErrors.course_and_university;
        }
        break;
      case 'team_name':
        if (formData.has_team && !value.trim()) {
          newErrors.team_name = "Please enter your team name";
        } else {
          delete newErrors.team_name;
        }
        break;
      case 'team_lead_email':
        if (formData.has_team && !formData.is_team_lead && value && !validateEmail(value)) {
          newErrors.team_lead_email = "Please enter a valid team lead email address";
        } else {
          delete newErrors.team_lead_email;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleFieldChange = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    handleFieldValidation(field, value);
  };

  const handleTeamChange = (hasTeam: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      has_team: hasTeam,
      is_team_lead: null,
      team_lead_email: null,
      team_name: null
    }));
  };

  const handleRoleChange = (isTeamLead: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      is_team_lead: isTeamLead,
      team_lead_email: isTeamLead ? null : prev.team_lead_email
    }));
  };

  return (
    <Card className="relative w-full max-w-md mx-auto overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Register for HackXperience 2025</CardTitle>
        <CardDescription className="text-center">
          Join the ultimate hackathon experience
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => handleFieldChange('full_name', e.target.value)}
              onBlur={(e) => handleFieldValidation('full_name', e.target.value)}
              placeholder="John Doe"
              className={errors.full_name ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.full_name && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.full_name}
              </p>
            )}
          </div>
          
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={(e) => handleFieldValidation('email', e.target.value)}
              placeholder="you@example.com"
              className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="sim_id">SIM ID</Label>
            <Input
              id="sim_id"
              type="text"
              required
              value={formData.sim_id}
              onChange={(e) => handleFieldChange('sim_id', e.target.value)}
              onBlur={(e) => handleFieldValidation('sim_id', e.target.value)}
              placeholder="12345678"
              className={errors.sim_id ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.sim_id && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.sim_id}
              </p>
            )}
          </div>
          
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="course_and_university">Course and University</Label>
            <Input
              id="course_and_university"
              type="text"
              required
              value={formData.course_and_university}
              onChange={(e) => handleFieldChange('course_and_university', e.target.value)}
              onBlur={(e) => handleFieldValidation('course_and_university', e.target.value)}
              placeholder="Bachelor of Computer Science (Big Data & Cybersecurity) UOW"
              className={errors.course_and_university ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.course_and_university && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.course_and_university}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label>Do you have a team?</Label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="has_team"
                  checked={formData.has_team === true}
                  onChange={() => handleTeamChange(true)}
                  className="h-4 w-4"
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="has_team"
                  checked={formData.has_team === false}
                  onChange={() => handleTeamChange(false)}
                  className="h-4 w-4"
                />
                <span className="text-sm">No</span>
              </label>
            </div>
          </div>

          {formData.has_team && (
            <>
              <div className="flex flex-col space-y-1.5">
                <Label>What is your role?</Label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="is_team_lead"
                      checked={formData.is_team_lead === true}
                      onChange={() => handleRoleChange(true)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Team Lead</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="is_team_lead"
                      checked={formData.is_team_lead === false}
                      onChange={() => handleRoleChange(false)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Team Member</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="team_name">Team Name</Label>
                <Input
                  id="team_name"
                  type="text"
                  required
                  value={formData.team_name || ''}
                  onChange={(e) => handleFieldChange('team_name', e.target.value)}
                  onBlur={(e) => handleFieldValidation('team_name', e.target.value)}
                  placeholder="Enter your team name"
                  className={errors.team_name ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.team_name && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.team_name}
                  </p>
                )}
              </div>

              {formData.is_team_lead === false && (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="team_lead_email">Team Lead&apos;s Email</Label>
                  <Input
                    id="team_lead_email"
                    type="email"
                    required
                    value={formData.team_lead_email || ''}
                    onChange={(e) => handleFieldChange('team_lead_email', e.target.value)}
                    onBlur={(e) => handleFieldValidation('team_lead_email', e.target.value)}
                    placeholder="team.lead@example.com"
                    className={errors.team_lead_email ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.team_lead_email && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.team_lead_email}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          <InteractiveHoverButton
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Registering..." : "Register Now"}
          </InteractiveHoverButton>
        </form>
      </CardContent>
      <BorderBeam duration={8} size={100} />
    </Card>
  );
} 