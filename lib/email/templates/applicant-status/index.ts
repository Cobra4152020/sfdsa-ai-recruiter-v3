import { pending } from "./pending";
import { contacted } from "./contacted";
import { interested } from "./interested";
import { applied } from "./applied";
import { hired } from "./hired";
import { rejected } from "./rejected";

export const applicantStatusTemplates = {
  pending,
  contacted,
  interested,
  applied,
  hired,
  rejected,
};

// Helper function to get the template based on status
export function getStatusTemplate(status: string) {
  const templateKey =
    status.toLowerCase() as keyof typeof applicantStatusTemplates;

  if (templateKey in applicantStatusTemplates) {
    return applicantStatusTemplates[templateKey];
  }

  // Default to pending if status doesn't match
  return applicantStatusTemplates.pending;
}
