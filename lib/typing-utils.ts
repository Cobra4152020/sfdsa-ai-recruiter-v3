/**
 * Calculates a realistic typing time for a message
 * @param message The message to calculate typing time for
 * @returns Typing time in milliseconds
 */
export function calculateTypingTime(message: string): number {
  if (!message) return 0;

  // Base typing speed (characters per minute)
  const baseTypingSpeed = 300;

  // Add variability (±20%)
  const variability = 0.2;
  const randomFactor = 1 + (Math.random() * variability * 2 - variability);

  // Calculate base time (60000ms = 1 minute)
  let typingTime = (message.length / (baseTypingSpeed * randomFactor)) * 60000;

  // Add thinking time based on message complexity
  const complexity = calculateComplexity(message);
  const thinkingTime = complexity * 500; // 0.5 seconds per complexity point

  // Add random pauses
  const pauseCount = Math.floor(message.length / 50); // One pause per ~50 chars
  const pauseTime = pauseCount * (Math.random() * 800 + 200); // 200-1000ms per pause

  // Total time
  typingTime = typingTime + thinkingTime + pauseTime;

  // Ensure minimum and maximum times
  const minTime = 1000; // Minimum 1 second
  const maxTime = 8000; // Maximum 8 seconds

  return Math.min(Math.max(typingTime, minTime), maxTime);
}

/**
 * Calculates the complexity of a message (0-10 scale)
 */
function calculateComplexity(message: string): number {
  // Simple complexity based on length, punctuation, and word length
  const length = Math.min(message.length / 100, 5); // 0-5 points for length

  // Count punctuation marks that indicate complex sentences
  const punctuation = (message.match(/[.,:;?!]/g) || []).length;
  const punctuationScore = Math.min(punctuation / 5, 2); // 0-2 points for punctuation

  // Average word length as a complexity indicator
  const words = message.split(/\s+/);
  const avgWordLength =
    words.reduce((sum, word) => sum + word.length, 0) / (words.length || 1);
  const wordLengthScore = Math.min((avgWordLength - 3) / 2, 3); // 0-3 points for word length

  return length + punctuationScore + wordLengthScore;
}

/**
 * Simulates realistic typing with variable speed and pauses
 * @param text The text to type
 * @param onUpdate Callback that receives the current text as it's being typed
 * @param onComplete Callback when typing is complete
 * @returns A function to cancel the typing animation
 */
export function simulateRealisticTyping(
  text: string,
  onUpdate: (text: string) => void,
  onComplete: () => void,
): () => void {
  let currentIndex = 0;
  let currentText = "";
  let timeoutId: NodeJS.Timeout | null = null;

  // Calculate a realistic base typing speed (characters per second)
  // Shorter messages are typed faster than longer ones
  const getBaseSpeed = () => {
    // Between 5 and 15 characters per second, inversely proportional to length
    const baseSpeed = Math.max(5, Math.min(15, 20 - text.length / 20));
    return 1000 / baseSpeed; // Convert to ms per character
  };

  const baseSpeed = getBaseSpeed();

  const typeNextCharacter = () => {
    if (currentIndex >= text.length) {
      onComplete();
      return;
    }

    const char = text[currentIndex];
    currentText += char;
    onUpdate(currentText);
    currentIndex++;

    // Calculate delay for next character
    let delay = baseSpeed;

    // Add longer pauses after punctuation
    if (char === ".") {
      delay += Math.random() * 500 + 300; // 300-800ms pause after periods
    } else if (char === ",") {
      delay += Math.random() * 200 + 100; // 100-300ms pause after commas
    } else if (char === "?" || char === "!") {
      delay += Math.random() * 400 + 200; // 200-600ms pause after question/exclamation marks
    }

    // Occasionally add random pauses to simulate thinking
    if (Math.random() < 0.05) {
      delay += Math.random() * 300 + 100; // 100-400ms random pause (5% chance)
    }

    // Schedule next character
    timeoutId = setTimeout(typeNextCharacter, delay);
  };

  // Start typing
  timeoutId = setTimeout(typeNextCharacter, 100);

  // Return a function to cancel the typing
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
}
