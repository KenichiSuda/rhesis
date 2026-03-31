import { UUID } from 'crypto';

/** Valid environment types for projects */
export type ProjectEnvironment = 'development' | 'staging' | 'production';

/** Valid use cases for projects */
export type ProjectUseCase = 'chatbot' | 'assistant' | 'advisor' | 'other';

/** Valid sort orders for project queries */
export type SortOrder = 'asc' | 'desc';

/**
 * Project attributes stored in the JSONB attributes column.
 * New fields should be added here rather than as top-level model columns.
 */
export interface ProjectAttributes {
  /** Language codes for generated test prompts (e.g. ['en', 'ja']) */
  prompt_languages?: string[];
  [key: string]: unknown;
}

/**
 * Base interface for common project properties
 * These are the core properties recognized by the backend API
 */
export interface ProjectBase {
  name: string;
  description?: string;
  is_active?: boolean;
  user_id?: UUID | string;
  owner_id?: UUID | string;
  organization_id?: UUID | string;
  attributes?: ProjectAttributes;
}

/**
 * Interface for project query parameters
 */
export interface ProjectsQueryParams {
  skip?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: SortOrder;
  $filter?: string;
}

/**
 * Interface for project creation
 */
export interface ProjectCreate extends ProjectBase {
  icon?: string;
}

/**
 * Interface for project updates, all fields optional
 */
export type ProjectUpdate = Partial<ProjectBase>;

/**
 * User interface for nested objects in project responses
 */
export interface ProjectUser {
  id: UUID | string;
  name: string;
  email: string;
  family_name: string;
  given_name: string;
  picture: string;
  organization_id: UUID | string;
}

/**
 * Organization interface for nested objects in project responses
 */
export interface ProjectOrganization {
  id: UUID | string;
  name: string;
  description: string;
  email: string;
  user_id: UUID | string;
}

/**
 * System information for a project
 */
export interface ProjectSystem {
  name: string;
  description: string;
  primary_goals: string[];
  key_capabilities: string[];
}

/**
 * Agent definition for a project
 */
export interface ProjectAgent {
  name: string;
  description: string;
  responsibilities: string[];
}

/**
 * Generic project entity used for requirements, scenarios, and personas
 */
export interface ProjectEntity {
  name: string;
  description: string;
}

/**
 * Frontend-specific fields that aren't part of the backend model
 */
export interface ProjectFrontendFields {
  environment?: ProjectEnvironment | string;
  useCase?: ProjectUseCase | string;
  icon?: string;
  tags?: string[];
  createdAt?: string;
  system?: ProjectSystem;
  agents?: ProjectAgent[];
  requirements?: ProjectEntity[];
  scenarios?: ProjectEntity[];
  personas?: ProjectEntity[];
}

/**
 * Full project model as returned by the API
 */
export interface Project extends ProjectBase, ProjectFrontendFields {
  id: UUID | string;

  created_at?: string;
  updated_at?: string;

  user: ProjectUser;
  owner: ProjectUser;
  organization: ProjectOrganization;
}
