import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, Server } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("admin@erp.com");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-erp-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-erp-900 z-0 skew-y-3 origin-top-left scale-110"></div>

      <div className="bg-white p-8 rounded-sm shadow-xl w-full max-w-md z-10 border-t-4 border-blue-600">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-erp-900 rounded flex items-center justify-center shadow-lg">
              <Server className="text-white w-7 h-7" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-erp-900">Enterprise Resource Pro</h1>
          <p className="text-sm text-erp-500 mt-1">Industry 4.0 Management Suite</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 text-red-700 p-3 rounded-sm text-xs border border-red-100 text-center">{error}</div>}

          <div className="space-y-1">
            <label className="text-xs font-bold text-erp-700 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-1.5 w-4 h-4 text-erp-400" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-9"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-erp-700 uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute left-2.5 top-1.5 w-4 h-4 text-erp-400" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 h-9"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-9 text-sm bg-blue-700 hover:bg-blue-800" disabled={isSubmitting}>
            {isSubmitting ? "Authenticating..." : "Secure Login"}
          </Button>

          <div className="pt-4 text-center">
            <span className="text-xs text-erp-400">Demo Credentials: admin@erp.com / admin</span>
          </div>
        </form>
      </div>

      <div className="absolute bottom-4 text-[10px] text-erp-400">© 2024 ERP Next Gen. Authorized Personnel Only.</div>
    </div>
  );
};
