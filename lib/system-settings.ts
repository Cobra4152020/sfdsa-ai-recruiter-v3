import { getServiceSupabase } from "@/app/lib/supabase/server";

/**
 * Get a system setting from the database
 * @param key The setting key
 * @param defaultValue Default value if setting doesn't exist
 * @returns The setting value or default value
 */
export async function getSystemSetting(
  key: string,
  defaultValue = "",
): Promise<string> {
  try {
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", key)
      .single();

    if (error || !data) {
      console.warn(
        `System setting ${key} not found, using default value: ${defaultValue}`,
      );
      return defaultValue;
    }

    return data.value;
  } catch (error) {
    console.error(`Error fetching system setting ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Set a system setting in the database
 * @param key The setting key
 * @param value The setting value
 * @param description Optional description
 * @returns Success status
 */
export async function setSystemSetting(
  key: string,
  value: string,
  description?: string,
): Promise<boolean> {
  try {
    const supabase = getServiceSupabase();

    const { error } = await supabase.from("system_settings").upsert(
      {
        key,
        value,
        description,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "key",
      },
    );

    if (error) {
      console.error(`Error setting system setting ${key}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error setting system setting ${key}:`, error);
    return false;
  }
}
