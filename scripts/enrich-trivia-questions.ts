import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Supabase URL or service key is missing. Make sure .env.local is set up.",
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixLocalImagePaths() {
  console.log("Starting script to fix local image paths...");

  // Step 1: Fetch questions with local image paths (e.g., starts with '/')
  // We exclude '//' to avoid matching protocol-relative URLs, just in case.
  const { data: questions, error } = await supabase
    .from("trivia_questions")
    .select("*")
    .like("image_url", "/%")
    .not("image_url", "like", "//%");

  if (error) {
    console.error("Error fetching questions with local paths:", error);
    return;
  }

  if (!questions || questions.length === 0) {
    console.log("No questions with local image paths found. Database is clean!");
    return;
  }

  console.log(`Found ${questions.length} questions with invalid local image paths.`);

  for (const question of questions) {
    try {
      console.log(`\nProcessing question: ${question.question}`);
      console.log(`  -> Old invalid path: ${question.image_url}`);

      const correctAnswerText = question.options[question.correct_answer];
      
      const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(correctAnswerText || question.category || 'history')}`;
      const imageAlt = `A relevant image for the trivia question about ${correctAnswerText || question.category}`;
      
      console.log(`  -> Found new image: ${imageUrl}`);

      // Update Database
      console.log(`  -> Updating database for question ID: ${question.id}`);
      const { error: updateError } = await supabase
        .from("trivia_questions")
        .update({
          image_url: imageUrl,
          image_alt: imageAlt,
        })
        .eq("id", question.id);

      if (updateError) {
        console.error(`  -> Failed to update question ${question.id}:`, updateError.message);
      } else {
        console.log(`  -> Successfully fixed image path for question ${question.id}`);
      }
    } catch (e: any) {
      console.error(`  -> An unexpected error occurred for question ${question.id}:`, e.message);
    }
  }

  console.log("\nLocal image path fixing process complete.");
}

fixLocalImagePaths().catch((e) => {
  console.error("Fatal error running local path fixing script:", e);
  process.exit(1);
});