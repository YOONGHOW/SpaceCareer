// /types/firestoreTypes.ts
export interface Company {
  userId: string;
  _companyType: string;
  _companySize: string;
  _companyLocation: string;
  _companyDescription: string;
}

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

export interface courses {
  course_title: string;
  course_link: string;
  course_image: string;
  course_id: string;
  company_name: string;
  review: number;
  course_description: string;
}

export interface certificates {
  cert_id: string;
  company_name: string;
  cert_name: string;
  cert_type: string;
  cert_description: string;
  review: number;
}

export interface jobApplied {
  jobApplied_id: string;
  jobId: string;
  userId: string;
  jobStatus: string;
  jobDetails?: jobs;
}

export interface certRegister {
  certId: string;
  certRegisted_id: string;
  userId: string;
  certDetails?: certificates;
  certStatus: string;
}
export interface courseRegister {
  course_id: string;
  courseRegister_id: string;
  userId: string;
  courseDetails?: courses;
  courseStatus: string;
}
