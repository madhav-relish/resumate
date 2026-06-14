"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Experience = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  link: string;
  githubLink?: string;
  portfolioOnly?: boolean;
};

export type OpenSource = {
  id: string;
  project: string;
  role: string;
  description: string;
  link: string;
};

export type PersonalInfo = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github?: string;
  linkedin?: string;
  summary: string;
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  openSource: OpenSource[];
  selectedTemplate: string;
};

const initialData: ResumeData = {
  selectedTemplate: 'modern',
  personalInfo: {
    fullName: "Jane Doe",
    jobTitle: "Frontend Developer",
    email: "jane.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    website: "janedoe.dev",
    summary: "Creative and detail-oriented frontend developer with a passion for building beautiful user interfaces. Experienced in React, Next.js, and modern CSS techniques.",
  },
  experience: [
    {
      id: "1",
      company: "Tech Innovations Inc.",
      position: "Senior UI Developer",
      startDate: "2021-06",
      endDate: "",
      current: true,
      description: "Led the redesign of the core web application, improving load times by 40% and increasing user engagement by 25%. Built a component library from scratch.",
    }
  ],
  education: [
    {
      id: "1",
      institution: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2016-09",
      endDate: "2020-05",
    }
  ],
  skills: [
    { id: "1", name: "React", category: "Frontend" },
    { id: "2", name: "Next.js", category: "Frontend" },
    { id: "3", name: "TypeScript", category: "Languages" },
    { id: "4", name: "CSS/SASS", category: "Frontend" }
  ],
  projects: [
    {
      id: "1",
      title: "E-commerce Dashboard",
      description: "A full-stack dashboard for managing inventory and tracking sales. Built with Next.js, Prisma, and Tailwind CSS.",
      link: "github.com/janedoe/dashboard"
    }
  ],
  openSource: [
    {
      id: "1",
      project: "React",
      role: "Contributor",
      description: "Fixed a core hydration bug in concurrent mode, improving SSR performance across thousands of applications.",
      link: "github.com/facebook/react/pull/12345"
    }
  ]
};

type ResumeContextType = {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setResumeData(json.data);
        } else {
          // Fallback to local storage if API didn't have data.json
          const savedData = localStorage.getItem("resumateData");
          if (savedData) {
            try {
              const parsed = JSON.parse(savedData);
              setResumeData(parsed);
              // Save it to API to seed the file
              fetch('/api/data', { method: 'POST', body: savedData });
            } catch (e) {}
          }
        }
        setIsLoaded(true);
      })
      .catch(err => {
        console.error("Failed to load data from API", err);
        // Fallback
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("resumateData", JSON.stringify(resumeData));
      
      // Debounce API save to prevent spamming the filesystem
      const timeoutId = setTimeout(() => {
        fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resumeData)
        }).catch(err => console.error("Failed to save to API", err));
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [resumeData, isLoaded]);

  // Don't render until client side to avoid hydration mismatch with localStorage
  if (!isLoaded) return null;

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
