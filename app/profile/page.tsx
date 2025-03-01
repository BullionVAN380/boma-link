'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircleIcon, BellIcon, KeyIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to view your profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block rounded-full bg-indigo-100 p-6 mb-4">
            <UserCircleIcon className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Profile</h1>
          <p className="text-xl text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="w-full space-y-8">
            <TabsList className="grid w-full grid-cols-3 gap-4 bg-transparent p-1">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6 py-3 rounded-lg shadow-sm"
              >
                Profile Info
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6 py-3 rounded-lg shadow-sm"
              >
                Preferences
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6 py-3 rounded-lg shadow-sm"
              >
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-lg">
                  <CardTitle className="text-2xl text-indigo-900">Profile Information</CardTitle>
                  <CardDescription className="text-indigo-700">
                    Your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? "destructive" : "outline"}
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        defaultValue={session.user?.name || ''}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={session.user?.email || ''}
                        disabled={!isEditing}
                      />
                    </div>
                    {isEditing && (
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Save Changes
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-lg">
                  <CardTitle className="text-2xl text-indigo-900">Notification Preferences</CardTitle>
                  <CardDescription className="text-indigo-700">
                    Manage your notification settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <NotificationPreference
                      title="Property Updates"
                      description="Get notified about new properties matching your criteria"
                      icon={<HomeIcon className="h-6 w-6" />}
                    />
                    <NotificationPreference
                      title="Application Status"
                      description="Receive updates about your housing applications"
                      icon={<BellIcon className="h-6 w-6" />}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-lg">
                  <CardTitle className="text-2xl text-indigo-900">Security Settings</CardTitle>
                  <CardDescription className="text-indigo-700">
                    Manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                      Update Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function NotificationPreference({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <Button
        variant={enabled ? "default" : "outline"}
        onClick={() => setEnabled(!enabled)}
        className={enabled ? "bg-indigo-600 hover:bg-indigo-700" : ""}
      >
        {enabled ? 'Enabled' : 'Disabled'}
      </Button>
    </div>
  );
}
