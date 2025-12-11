import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Briefcase, Shield, Save } from "lucide-react";

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    department: user?.department || "",
    role: user?.role || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      updateUser(formData);
      setIsSaving(false);
      alert("Profile updated successfully");
    }, 800);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-erp-900 mb-6 flex items-center gap-2">
        <User className="w-6 h-6" /> My Profile
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 bg-white border-t-4 border-t-blue-600">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="w-24 h-24 bg-erp-100 rounded-full flex items-center justify-center text-2xl font-bold text-erp-600 border-4 border-white shadow-lg mb-4">
              {user?.avatar || user?.name?.charAt(0) || "U"}
            </div>
            <h3 className="text-lg font-bold text-erp-900">{user?.name}</h3>
            <p className="text-sm text-erp-500 mb-4">{user?.email}</p>

            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs py-2 border-b border-erp-100">
                <span className="text-erp-500">Employee ID</span>
                <span className="font-mono font-medium">{user?.id}</span>
              </div>
              <div className="flex justify-between text-xs py-2 border-b border-erp-100">
                <span className="text-erp-500">Joined</span>
                <span className="font-medium">March 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Edit Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-erp-700 uppercase">Full Name</label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-erp-700 uppercase">Department</label>
                <div className="relative">
                  <Briefcase className="absolute left-2.5 top-1.5 w-3 h-3 text-erp-400" />
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-erp-700 uppercase">Role / Title</label>
                <Input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-erp-700 uppercase">Email (Read Only)</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1.5 w-3 h-3 text-erp-400" />
                  <Input value={user?.email} disabled className="pl-8 bg-erp-50" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-erp-100 mt-4">
              <h4 className="text-xs font-bold text-erp-700 uppercase mb-2 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Permissions
              </h4>
              <div className="flex gap-2">
                {user?.permissions?.map((perm) => (
                  <span
                    key={perm}
                    className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100 uppercase font-bold"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-3 h-3 mr-2" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
