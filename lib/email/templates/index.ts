import { badgeEarned } from "./badge-earned";
import { nftAwarded } from "./nft-awarded";
import { welcome } from "./welcome";
import { applicationStatus } from "./application-status";
import {
  applicantStatusTemplates,
  getStatusTemplate,
} from "./applicant-status";

export const emailTemplates = {
  badgeEarned,
  nftAwarded,
  welcome,
  applicationStatus,
  applicantStatus: applicantStatusTemplates,
  getStatusTemplate,
};
