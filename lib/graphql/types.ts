/* eslint-disable */
/**********************************************************************
 *** THIS IS AN AUTO-GENERATED FILE. PLEASE DO NOT MODIFY DIRECTLY. ***
 **********************************************************************/
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date custom scalar type */
  Date: any;
};

export enum Aid {
  Cane = 'CANE',
  ElectricChair = 'ELECTRIC_CHAIR',
  ManualChair = 'MANUAL_CHAIR',
  Scooter = 'SCOOTER',
  Walker = 'WALKER',
}

export type Applicant = {
  __typename?: 'Applicant';
  id: Scalars['ID'];
  firstName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  dateOfBirth: Scalars['Date'];
  gender: Gender;
  email?: Maybe<Scalars['String']>;
  phone: Scalars['String'];
  province: Province;
  city: Scalars['String'];
  address: Scalars['String'];
  postalCode: Scalars['String'];
  rcdUserId?: Maybe<Scalars['Int']>;
};

export enum ApplicantStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Deceased = 'DECEASED',
}

export type CreateApplicantInput = {
  firstName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  dateOfBirth: Scalars['Date'];
  gender: Gender;
  email?: Maybe<Scalars['String']>;
  phone: Scalars['String'];
  province: Province;
  city: Scalars['String'];
  address: Scalars['String'];
  postalCode: Scalars['String'];
  rcdUserId?: Maybe<Scalars['Int']>;
};

export type CreateApplicantResult = {
  __typename?: 'CreateApplicantResult';
  ok: Scalars['Boolean'];
};

export type CreateEmployeeInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  role: Role;
};

export type CreateEmployeeResult = {
  __typename?: 'CreateEmployeeResult';
  ok: Scalars['Boolean'];
};

export type CreatePhysicianInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  mspNumber: Scalars['Int'];
  address: Scalars['String'];
  city: Scalars['String'];
  province: Province;
  postalCode: Scalars['String'];
  phone: Scalars['String'];
  status: PhysicianStatus;
  notes?: Maybe<Scalars['String']>;
};

export type CreatePhysicianResult = {
  __typename?: 'CreatePhysicianResult';
  ok: Scalars['Boolean'];
};

export type Employee = {
  __typename?: 'Employee';
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  role: Role;
};

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER',
}

export type Meta = {
  __typename?: 'Meta';
  orgName: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createApplicant: CreateApplicantResult;
  createEmployee: CreateEmployeeResult;
  createPhysician: CreatePhysicianResult;
};

export type MutationCreateApplicantArgs = {
  input: CreateApplicantInput;
};

export type MutationCreateEmployeeArgs = {
  input: CreateEmployeeInput;
};

export type MutationCreatePhysicianArgs = {
  input: CreatePhysicianInput;
};

export enum PaymentType {
  Mastercard = 'MASTERCARD',
  Visa = 'VISA',
  Etransfer = 'ETRANSFER',
  Cash = 'CASH',
  Cheque = 'CHEQUE',
  Debit = 'DEBIT',
  MoneyOrder = 'MONEY_ORDER',
}

export type Physician = {
  __typename?: 'Physician';
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  mspNumber: Scalars['Int'];
  address: Scalars['String'];
  city: Scalars['String'];
  province: Province;
  postalCode: Scalars['String'];
  phone: Scalars['String'];
  status: PhysicianStatus;
  notes?: Maybe<Scalars['String']>;
};

export enum PhysicianStatus {
  Deceased = 'DECEASED',
  Cancelled = 'CANCELLED',
  Retired = 'RETIRED',
  Active = 'ACTIVE',
  Resigned = 'RESIGNED',
  TemporarilyInactive = 'TEMPORARILY_INACTIVE',
  Relocated = 'RELOCATED',
}

export enum Province {
  Bc = 'BC',
  Ab = 'AB',
  Sk = 'SK',
  Mb = 'MB',
  On = 'ON',
  Qc = 'QC',
  Ns = 'NS',
  Pe = 'PE',
  Nl = 'NL',
  Nb = 'NB',
  Nu = 'NU',
  Nt = 'NT',
  Yt = 'YT',
}

export type Query = {
  __typename?: 'Query';
  meta: Meta;
  applicants?: Maybe<Array<Applicant>>;
  employees?: Maybe<Array<Employee>>;
  physicians?: Maybe<Array<Physician>>;
};

export enum Role {
  Admin = 'ADMIN',
  Accounting = 'ACCOUNTING',
  Secretary = 'SECRETARY',
}
