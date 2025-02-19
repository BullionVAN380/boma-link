export interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  location: {
    city: string;
    state: string;
    country: string;
    type: 'remote' | 'onsite' | 'hybrid';
  };
  requirements: string[];
  benefits?: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  employer: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'active' | 'closed' | 'draft';
  applications?: Array<{
    _id: string;
    applicant: {
      _id: string;
      name: string;
      email: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}
