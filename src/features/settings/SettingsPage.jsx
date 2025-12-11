import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Globe, Bell, Lock } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export const SettingsPage = () => {
  const { addToast } = useToast();

  const handleSave = () => {
    addToast({ title: "Settings Saved", description: "System configuration updated successfully.", variant: "success" });
  };

  return (
    <div className="p-6 h-full overflow-y-auto max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-erp-900 mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6" /> System Configuration
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="w-4 h-4 text-blue-600" /> General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-erp-600">Company Name</label>
              <Input defaultValue="Enterprise Resource Pro Inc." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-erp-600">Currency</label>
                <select className="w-full h-7 border border-erp-300 rounded-sm text-xs px-2">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-erp-600">Timezone</label>
                <select className="w-full h-7 border border-erp-300 rounded-sm text-xs px-2">
                  <option>UTC (GMT+0)</option>
                  <option>EST (GMT-5)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="w-4 h-4 text-green-600" /> Security Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-2 border border-erp-100 rounded-sm">
              <span className="text-xs font-medium">Require 2FA for Admin</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div className="flex items-center justify-between p-2 border border-erp-100 rounded-sm">
              <span className="text-xs font-medium">Session Timeout (mins)</span>
              <Input type="number" defaultValue="30" className="w-20" />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="w-4 h-4 text-yellow-600" /> Notification Defaults
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-2 border border-erp-100 rounded-sm">
              <span className="text-xs font-medium">Email Alerts on Critical Inventory</span>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="flex items-center justify-between p-2 border border-erp-100 rounded-sm">
              <span className="text-xs font-medium">Daily Summary Report</span>
              <input type="checkbox" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} className="w-32">
          Save Changes
        </Button>
      </div>
    </div>
  );
};
