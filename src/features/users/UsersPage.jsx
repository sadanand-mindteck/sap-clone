import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Plus, Search, User, Trash2, Edit } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export const UsersPage = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await apiClient.get("/users")).data,
  });

  const createUserMutation = useMutation({
    mutationFn: async (data) => (await apiClient.post("/users", data)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      addToast({ title: "User Created", variant: "success" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => (await apiClient.delete(`/users/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({ title: "User Deleted", variant: "default" });
    },
  });

  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white border border-erp-300 shadow-sm rounded-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-erp-200">
        <h2 className="text-lg font-bold text-erp-900 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" /> User Management
        </h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Add User
        </Button>
      </div>

      {/* Toolbar */}
      <div className="p-2 bg-erp-50 border-b border-erp-200 flex justify-end">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1.5 w-3 h-3 text-erp-400" />
          <Input placeholder="Search users..." className="pl-7" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-erp-100 text-erp-700 font-semibold">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Role</th>
              <th className="p-3">Department</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-erp-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-erp-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-erp-200 flex items-center justify-center text-xs font-bold text-erp-700">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-erp-900">{user.name}</div>
                        <div className="text-erp-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-medium">{user.role}</td>
                  <td className="p-3 text-erp-600">{user.department}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="xs" variant="ghost">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => {
                          if (confirm("Delete user?")) deleteUserMutation.mutate(user.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => createUserMutation.mutate(data)}
        isLoading={createUserMutation.isPending}
      />
    </div>
  );
};

const CreateUserModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Operator",
    department: "",
    password: "user123",
  });

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New User">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}
        className="space-y-4"
      >
        <div className="space-y-1">
          <label className="text-xs font-bold text-erp-600">Full Name</label>
          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-erp-600">Email</label>
          <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-erp-600">Role</label>
            <select
              className="w-full h-7 border border-erp-300 rounded-sm text-xs px-2"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Operator">Operator</option>
              <option value="Auditor">Auditor</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-erp-600">Department</label>
            <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-erp-600">Default Password</label>
          <Input value={formData.password} disabled className="bg-erp-50" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
