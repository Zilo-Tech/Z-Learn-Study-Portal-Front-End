"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Streak { id: number; username: string; current_streak: number; longest_streak: number; last_activity_date: string }

export default function StreaksPage() {
  const [me, setMe] = useState<Streak | null>(null);

  const load = async () => {
    const res = await api.get('/streaks/me/');
    setMe(res.data || null);
  };

  useEffect(() => { load(); }, []);

  const ping = async () => {
    await api.post('/streaks/me/', {});
    await load();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Streak</h1>
      <Card>
        <CardHeader><CardTitle>Progress</CardTitle></CardHeader>
        <CardContent>
          {me ? (
            <div className="text-sm">
              <div>Current: <span className="font-semibold">{me.current_streak}</span> days</div>
              <div>Longest: <span className="font-semibold">{me.longest_streak}</span> days</div>
              <div>Last activity: {me.last_activity_date}</div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No streak data yet.</div>
          )}
          <div className="mt-3"><Button onClick={ping}>Ping activity</Button></div>
        </CardContent>
      </Card>
    </div>
  );
}

