// TODO: Rename
export type GenerateApplicantsReportApplications = {
  rcdUserId: number | null;
  firstName: string | null;
  middleName?: string | null;
  lastName?: string | null;
  dateOfBirth?: Date | null;
  createdAt?: Date | null;
  paymentMethod?: string | null;
  processingFee?: number | null;
  donationAmount?: number | null;
  permits?: { rcdPermitId: number } | null;
  applicantName?: string | null;
  totalAmount?: number | null;
};
