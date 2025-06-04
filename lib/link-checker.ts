/**
 * Utility to check for broken links in the application
 */

export interface LinkCheckResult {
  url: string;
  status: number;
  ok: boolean;
  message: string;
  source?: string;
}

export async function checkLink(
  url: string,
  source?: string,
): Promise<LinkCheckResult> {
  try {
    // Handle relative URLs
    const fullUrl = url.startsWith("/")
      ? `${window.location.origin}${url}`
      : url;

    // Skip external links for now
    if (
      !fullUrl.includes(window.location.hostname) &&
      !fullUrl.startsWith("/")
    ) {
      return {
        url,
        status: 0,
        ok: true, // Assume external links are valid
        message: "External link - not checked",
        source,
      };
    }

    const response = await fetch(fullUrl, { method: "HEAD" });
    return {
      url,
      status: response.status,
      ok: response.ok,
      message: response.ok ? "Link is valid" : `HTTP error: ${response.status}`,
      source,
    };
  } catch (error) {
    return {
      url,
      status: 0,
      ok: false,
      message: `Error checking link: ${error instanceof Error ? error.message : String(error)}`,
      source,
    };
  }
}

export function findAllLinks(): string[] {
  const links: string[] = [];
  const anchors = document.querySelectorAll("a");

  anchors.forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (
      href &&
      !href.startsWith("#") &&
      !href.startsWith("javascript:") &&
      !links.includes(href)
    ) {
      links.push(href);
    }
  });

  return links;
}

export async function checkAllLinks(): Promise<LinkCheckResult[]> {
  const links = findAllLinks();
  const results = await Promise.all(links.map((link) => checkLink(link)));
  return results;
}
