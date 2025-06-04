export function scrollToElement(elementId: string): void {
  const element = document.getElementById(elementId);

  if (element) {
    // Add a small delay to ensure any layout shifts have completed
    setTimeout(() => {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }
}
