"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getGeographicData } from "@/lib/analytics-service";

interface GeographicData {
  zip_code: string;
  count: number;
}

interface GeographicMapProps {
  data: GeographicData[];
  isLoading: boolean;
}

export function GeographicMap({ data, isLoading }: GeographicMapProps) {
  const [userType, setUserType] = useState<"all" | "recruit" | "volunteer">(
    "all",
  );
  const [mapData, setMapData] = useState<GeographicData[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getGeographicData(userType);
      setMapData(data);
    } catch (error) {
      console.error("Error loading geographic data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setMapData(data);
    } else {
      loadData();
    }
  }, [data, userType, loadData]);

  if (isLoading || loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3C1F]"></div>
      </div>
    );
  }

  if (!mapData || mapData.length === 0) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center">
        <p className="text-lg font-medium text-gray-500">
          No geographic data available
        </p>
        <p className="text-sm text-gray-400">
          Try selecting a different user type
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Select
          value={userType}
          onValueChange={(value) =>
            setUserType(value as "all" | "recruit" | "volunteer")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="User Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="recruit">Recruits</SelectItem>
            <SelectItem value="volunteer">Volunteers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative h-[500px] border rounded-lg overflow-hidden">
        <iframe
          src={`https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=37.7749,-122.4194&zoom=12&maptype=roadmap`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
          <p className="text-lg font-medium text-gray-700">
            Map Visualization Placeholder
          </p>
          <p className="text-sm text-gray-500 mt-2">
            In a production environment, this would display a real map with user
            distribution
          </p>
          <div className="mt-6 w-full max-w-md">
            <h3 className="text-md font-medium mb-2">Top 5 Zip Codes</h3>
            <div className="space-y-2">
              {mapData.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.zip_code}</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${(item.count / mapData[0].count) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm">{item.count} users</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
