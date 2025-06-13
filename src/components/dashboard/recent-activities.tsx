"use client";

import { Activity, Calendar, Clock, FileText, UserPlus } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentActivities() {
  const activities = [
    {
      id: 1,
      description: "Emma Johnson - Regular checkup",
      icon: Calendar,
      time: "2 hours ago",
      title: "Appointment completed",
      type: "appointment",
    },
    {
      id: 2,
      description: "Sofia Rodriguez registered",
      icon: UserPlus,
      time: "4 hours ago",
      title: "New patient added",
      type: "patient",
    },
    {
      id: 3,
      description: "Growth chart updated for Michael Chen",
      icon: FileText,
      time: "6 hours ago",
      title: "Medical record updated",
      type: "record",
    },
    {
      id: 4,
      description: "David Kim requires follow-up",
      icon: Activity,
      time: "1 day ago",
      title: "Growth alert",
      type: "alert",
    },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-orange-500";
      case "appointment":
        return "bg-blue-500";
      case "patient":
        return "bg-green-500";
      case "record":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest updates and actions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}
              >
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium text-sm">{activity.title}</p>
                <p className="text-muted-foreground text-sm">{activity.description}</p>
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
