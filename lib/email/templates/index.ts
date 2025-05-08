import { badgeEarnedTemplate } from "./badge-earned"
import { nftAwardedTemplate } from "./nft-awarded"
import { welcomeTemplate } from "./welcome"
import { applicationStatusTemplate } from "./application-status"

export const emailTemplates = {
  badgeEarned: badgeEarnedTemplate,
  nftAwarded: nftAwardedTemplate,
  welcome: welcomeTemplate,
  applicationStatus: applicationStatusTemplate,
}

export type EmailTemplateType = keyof typeof emailTemplates
