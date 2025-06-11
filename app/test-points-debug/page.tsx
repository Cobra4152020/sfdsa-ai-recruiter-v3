"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/user-context";

export default function TestPointsDebugPage() {
  const { currentUser } = useUser();
  const [debugData, setDebugData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchDebugData = async () => {
    if (!currentUser?.id) return;

    setLoading(true);
    try {
      // Test direct points API
      const response = await fetch('/api/points/direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          points: 1,
          action: 'debug_test',
          description: 'Debug test - 1 point'
        }),
      });

      const result = await response.json();
      setDebugData(result);
    } catch (error) {
      setDebugData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const createUserRecord = async () => {
    if (!currentUser?.id) return;

    setLoading(true);
    try {
      const response = await fetch('/api/user/create-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id
        }),
      });

      const result = await response.json();
      setDebugData(result);
    } catch (error: any) {
      setDebugData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const award500Points = async () => {
    if (!currentUser?.id) return;

    setLoading(true);
    try {
      const response = await fetch('/api/points/direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          points: 500,
          action: 'application_submission',
          description: 'Manual award: 500 points for application submission'
        }),
      });

      const result = await response.json();
      setDebugData(result);
      
      // Refresh user context
      if (result.success) {
        window.location.reload();
      }
    } catch (error: any) {
      setDebugData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>🐛 Points Debug Tool</CardTitle>
          <p className="text-gray-600">
            Debug your points system and award missing points
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentUser && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Current User Info</h3>
              <div className="text-blue-800 space-y-1">
                <p><strong>ID:</strong> {currentUser.id}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Name:</strong> {currentUser.name}</p>
                <p><strong>Current Points:</strong> {currentUser.participation_count || 0}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Button onClick={fetchDebugData} disabled={loading || !currentUser}>
              {loading ? 'Testing...' : 'Test Points API (Add 1 Point)'}
            </Button>

            <Button 
              onClick={async () => {
                if (!currentUser?.id) return;
                setLoading(true);
                try {
                  const response = await fetch('/api/user/create-record', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: currentUser.id }),
                  });
                  const result = await response.json();
                  setDebugData(result);
                } catch (error: any) {
                  setDebugData({ error: error.message });
                } finally {
                  setLoading(false);
                }
              }} 
              disabled={loading || !currentUser} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Creating...' : '👤 Create User Record'}
            </Button>

            <Button onClick={award500Points} disabled={loading || !currentUser} className="w-full bg-green-600 hover:bg-green-700">
              {loading ? 'Awarding...' : '🎯 Award 500 Points for Application'}
            </Button>
          </div>

          {debugData && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">API Response:</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(debugData, null, 2)}
              </pre>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">🔍 Troubleshooting</h4>
            <div className="text-yellow-800 text-sm space-y-2">
              <p>1. Click "Test Points API" to see if the direct API works</p>
              <p>2. If successful, click "Award 500 Points" to get your missing application points</p>
              <p>3. Check the API response for any error messages</p>
              <p>4. If points still don't show, there may be a database schema issue</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 