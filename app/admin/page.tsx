'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminPropertyList from '@/components/admin/AdminPropertyList';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminContacts from '@/components/admin/AdminContacts';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('properties');

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <AdminPropertyList />
        </TabsContent>

        <TabsContent value="analytics">
          <AdminAnalytics />
        </TabsContent>

        <TabsContent value="contacts">
          <AdminContacts />
        </TabsContent>
      </Tabs>
    </div>
  );
}
