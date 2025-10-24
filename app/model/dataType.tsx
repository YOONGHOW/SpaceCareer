// /types/firestoreTypes.ts
export interface Education {
  userId: string;
  _academicResult: string;
  _educationLevel: string;
  _fieldOfStudy: string;
  _university: string;
}

export interface Skill {
  userId: string;
  _interestInput: string;
  _personalityInput: string;
  _skillInput: string;
}

export interface jobs {
  job_id: string;
  company_name: string;
  job_description: string;
  job_location: string;
  job_name: string;
  job_salary: number;
  job_type: string;
}
