"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SetupLoggingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState({
    enabled: true,
    level: "info",
    format: "json",
    destination: "file",
    filePath: "/var/log/app.log",
    retentionDays: 30,
    maxSize: "100mb",
    cloudEnabled: false,
    cloudProvider: "",
    cloudBucket: "",
    cloudRegion: "",
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Logging configuration saved",
        description: "The logging settings have been updated successfully.",
      });
    } catch {
      toast({
        title: "Error saving configuration",
        description: "Failed to save logging settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/dashboard")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-[#0A3C1F]">
            Logging Configuration
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Setup Application Logging</CardTitle>
            <CardDescription>
              Configure how the application handles logging and monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
                <TabsTrigger value="cloud">Cloud Integration</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Logging</Label>
                      <p className="text-sm text-gray-500">
                        Turn application logging on or off
                      </p>
                    </div>
                    <Switch
                      checked={config.enabled}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, enabled: checked })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Log Level</Label>
                    <Input
                      value={config.level}
                      onChange={(e) =>
                        setConfig({ ...config, level: e.target.value })
                      }
                      placeholder="info"
                    />
                    <p className="text-sm text-gray-500">
                      Specify the minimum log level (debug, info, warn, error)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Log Format</Label>
                    <Input
                      value={config.format}
                      onChange={(e) =>
                        setConfig({ ...config, format: e.target.value })
                      }
                      placeholder="json"
                    />
                    <p className="text-sm text-gray-500">
                      Choose between json or text format
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Log Destination</Label>
                    <Input
                      value={config.destination}
                      onChange={(e) =>
                        setConfig({ ...config, destination: e.target.value })
                      }
                      placeholder="file"
                    />
                    <p className="text-sm text-gray-500">
                      Where to store the logs (file, stdout, etc.)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>File Path</Label>
                    <Input
                      value={config.filePath}
                      onChange={(e) =>
                        setConfig({ ...config, filePath: e.target.value })
                      }
                      placeholder="/var/log/app.log"
                    />
                    <p className="text-sm text-gray-500">
                      Path where log files will be stored
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Retention (days)</Label>
                      <Input
                        type="number"
                        value={config.retentionDays}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            retentionDays: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="30"
                      />
                      <p className="text-sm text-gray-500">
                        How long to keep log files
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Max Size</Label>
                      <Input
                        value={config.maxSize}
                        onChange={(e) =>
                          setConfig({ ...config, maxSize: e.target.value })
                        }
                        placeholder="100mb"
                      />
                      <p className="text-sm text-gray-500">
                        Maximum size before rotation
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cloud">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Cloud Integration</Label>
                      <p className="text-sm text-gray-500">
                        Enable cloud storage for logs
                      </p>
                    </div>
                    <Switch
                      checked={config.cloudEnabled}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, cloudEnabled: checked })
                      }
                    />
                  </div>

                  {config.cloudEnabled && (
                    <>
                      <div className="space-y-2">
                        <Label>Cloud Provider</Label>
                        <Input
                          value={config.cloudProvider}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              cloudProvider: e.target.value,
                            })
                          }
                          placeholder="AWS, GCP, Azure"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Bucket Name</Label>
                        <Input
                          value={config.cloudBucket}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              cloudBucket: e.target.value,
                            })
                          }
                          placeholder="my-logs-bucket"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Region</Label>
                        <Input
                          value={config.cloudRegion}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              cloudRegion: e.target.value,
                            })
                          }
                          placeholder="us-west-1"
                        />
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/dashboard")}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
