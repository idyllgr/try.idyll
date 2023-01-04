
export interface User {
  fullname?: any;
  name?: string;
  id?: number;
  lastname?: string;
  firstname?: string;
  address?: string;
  age?: number;
  phone?: string;
  isActive?: boolean;
  email?: string;
  avatar?: string;
  email_verified_at?: null;
  section_id?: null;
  school_id?: number;
  deleted_at?: null;
  created_at?: Date;
  updated_at?: Date;
  roles?: Role[];
  section?: null;
  absences_count?: number;
  unjustified_absences_count?: number;
  justified_absences_count?: number;
  performances?: any;
  pivot?:   any;
}

export interface Role {
  id?: number;
  name?: string;
  description?: string;
  guard_name?: string;
  created_at?: Date;
  updated_at?: Date;
}

