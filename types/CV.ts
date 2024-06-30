// types/CV.ts

export interface CV {
    personal_info: PersonalInfo;
    summary: string;
    skills: Skills;
    work_experience: WorkExperience[];
    education: Education[];
    certifications: string[];
    other_skills: string[];
    languages: string[];
  }
  
  export interface PersonalInfo {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    address: Address;
  }
  
  export interface Address {
    street: string;
    street2?: string;
    city: string;
    state: string;
    zip_code: string;
  }
  
  export interface Skills {
    test_automation: string[];
    testing: string[];
    programming: string[];
    api_and_backend_development: string[];
    continuous_integration_and_deployment: string[];
    e_commerce: string[];
    databases_machine_learning_and_monitoring: string[];
    virtualization: string[];
    web_and_mobile_development: string[];
  }
  
  export interface WorkExperience {
    job_title: string;
    company: string;
    location: string;
    dates: {
      start: DateInfo;
      end: DateInfo | "Present";
    };
    description: string[];
  }
  
  export interface Education {
    degree: string;
    field: string;
    university: string;
    location: string;
    start_date: DateInfo;
    end_date: DateInfo;
  }
  
  export interface DateInfo {
    day: string;
    month: string;
    year: string;
  }