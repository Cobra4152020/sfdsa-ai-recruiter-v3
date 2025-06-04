"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PushNotificationPermission } from "@/components/push-notification-permission";
import { getClientSideSupabase } from "@/lib/supabase";

interface NotificationPreferencesProps {
  userId?: string | null;
}

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  donation_notifications: boolean;
  badge_notifications: boolean;
  system_notifications: boolean;
  achievement_notifications: boolean;
}

export function NotificationPreferences({
  userId,
}: NotificationPreferencesProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    donation_notifications: true,
    badge_notifications: true,
    system_notifications: true,
    achievement_notifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const supabase = getClientSideSupabase();
        const { data, error } = await supabase
          .from("user_notification_settings")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error("Error fetching notification settings:", error);
        toast({
          title: "Error",
          description: "Failed to load notification preferences.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [userId, toast]);

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveSettings = async () => {
    if (!userId) return;

    setSaving(true);

    try {
      const supabase = getClientSideSupabase();
      const { error } = await supabase
        .from("user_notification_settings")
        .upsert(
          {
            user_id: userId,
            ...settings,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          },
        );

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!userId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Please log in to manage your notification preferences.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Manage how you want to receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Delivery Methods</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email_notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="email_notifications"
              checked={settings.email_notifications}
              onCheckedChange={() => handleToggle("email_notifications")}
              disabled={loading || saving}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push_notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications in your browser
              </p>
            </div>
            <Switch
              id="push_notifications"
              checked={settings.push_notifications}
              onCheckedChange={() => handleToggle("push_notifications")}
              disabled={loading || saving}
            />
          </div>
          <div className="pt-2">
            <PushNotificationPermission userId={userId} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Types</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="donation_notifications">Donations</Label>
              <p className="text-sm text-muted-foreground">
                Notifications about donations and fundraising
              </p>
            </div>
            <Switch
              id="donation_notifications"
              checked={settings.donation_notifications}
              onCheckedChange={() => handleToggle("donation_notifications")}
              disabled={loading || saving}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="badge_notifications">Badges</Label>
              <p className="text-sm text-muted-foreground">
                Notifications about badge awards and achievements
              </p>
            </div>
            <Switch
              id="badge_notifications"
              checked={settings.badge_notifications}
              onCheckedChange={() => handleToggle("badge_notifications")}
              disabled={loading || saving}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="achievement_notifications">Achievements</Label>
              <p className="text-sm text-muted-foreground">
                Notifications about your achievements and milestones
              </p>
            </div>
            <Switch
              id="achievement_notifications"
              checked={settings.achievement_notifications}
              onCheckedChange={() => handleToggle("achievement_notifications")}
              disabled={loading || saving}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="system_notifications">System</Label>
              <p className="text-sm text-muted-foreground">
                Important system notifications and updates
              </p>
            </div>
            <Switch
              id="system_notifications"
              checked={settings.system_notifications}
              onCheckedChange={() => handleToggle("system_notifications")}
              disabled={loading || saving}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={saveSettings}
          disabled={loading || saving}
          className="ml-auto"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardFooter>
    </Card>
  );
}
