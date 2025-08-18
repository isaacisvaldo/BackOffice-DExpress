// src/types/prisma.ts

import type { City } from "@/services/location/cities.service";
export interface District {
    id: string;
    name: string
}

export interface Location {
    id: String;
    city: City;
    district: District;
    street: String;
}


export interface DesiredPosition {
    id: string;
    name: string;
    description?: string;
    label?: string;
}

export interface Gender {
    id: string;
    name: string;
    label: string;
}

export interface HighestDegree {
    id: string;
    name: string;
    label: string;
    level: number;
}

export interface MaritalStatus {
    id: string;
    name: string;
    label: string;
}

export interface ExperienceLevel {
    id: string;
    name: string;
    label: string;
}

export interface GeneralAvailability {
    id: string;
    name: string;
    label: string;
}

export interface Language {
    id: string;
    name: string;
    label: string;
}

export interface Skill {
    id: string;
    name: string;
    label: string;
}

export interface Course {
    id: string;
    name: string;
    label?: string;
}

export type JobApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

// To get the values as an array, you can use a `const` assertion
export const JobApplicationStatusValues = ["PENDING", "APPROVED", "REJECTED"] as const;

// A interface principal da candidatura
export interface JobApplication {
    id: string;
    locationId: string;
    fullName: string;
    identityNumber: string;
    phoneNumber: string;
    optionalPhoneNumber?: string;
    desiredPositionId: string;
    email: string;
    birthDate: string;
    genderId: string;
    highestDegreeId: string;
    maritalStatusId?: string;
    experienceLevelId?: string;
    generalAvailabilityId?: string;
    hasChildren: boolean;
    knownDiseases?: string;
    availabilityDate: string;
    status: JobApplicationStatus;
    createdAt: string;
    updatedAt: string;

    // Campos de relacionamento (se a sua API os incluir)
    desiredPosition?: DesiredPosition;
    gender?: Gender;
    location?: Location;
    highestDegree?: HighestDegree;
    maritalStatus?: MaritalStatus;
    experienceLevel?: ExperienceLevel;
    generalAvailability?: GeneralAvailability;
    languages: Language[];
    ProfessionalExperience:any;
    skills: Skill[];
    courses: Course[];
}
