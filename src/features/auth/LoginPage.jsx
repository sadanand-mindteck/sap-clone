import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Lock, Mail, Server, ArrowRight, CheckCircle2, ShieldCheck, Globe, BarChart3 } from "lucide-react";
import { cn } from "../../lib/utils";

const FeatureItem = ({ text, icon: Icon }) => (
  <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
      {Icon ? <Icon className="w-4 h-4 text-blue-300" /> : <CheckCircle2 className="w-4 h-4 text-blue-400" />}
    </div>
    <span className="text-sm text-erp-100 font-medium tracking-wide">{text}</span>
  </div>
);

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    // Simulate network delay for effect
    await new Promise((r) => setTimeout(r, 800));

    const result = await login(email, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans overflow-hidden">
      {/* Left Side - Visuals & Branding */}
      <div className="hidden lg:flex w-7/12 bg-erp-950 relative flex-col justify-between p-16 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
          <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        {/* Brand Header */}
        <div className="relative z-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/50 border border-blue-400/30">
              <Server className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-wide text-white">
              ERP<span className="text-blue-400">Next</span>
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight drop-shadow-sm">
            Orchestrate your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-100 to-indigo-200">
              entire enterprise.
            </span>
          </h1>
          <p className="text-erp-200 text-lg max-w-lg leading-relaxed font-light">
            The next-generation platform for intelligent resource planning, real-time analytics, and seamless workflow automation.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="relative z-10 grid grid-cols-1 gap-4 max-w-lg animate-fade-in" style={{ animationDelay: "200ms" }}>
          <FeatureItem text="Real-time Inventory & Batch Tracking" icon={BarChart3} />
          <FeatureItem text="Integrated Quality Control Workbench" icon={ShieldCheck} />
          <FeatureItem text="Global Supply Chain Management" icon={Globe} />
        </div>

        {/* Footer */}
        <div
          className="relative z-10 flex justify-between items-end border-t border-white/10 pt-6 mt-12 animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          <div className="text-xs text-erp-400">
            <p className="font-semibold text-erp-300 mb-2 uppercase tracking-wider text-[10px]">Trusted by industry leaders</p>
            <div className="flex gap-4 opacity-60">
              <div className="h-4 w-12 bg-white/20 rounded-sm"></div>
              <div className="h-4 w-12 bg-white/20 rounded-sm"></div>
              <div className="h-4 w-12 bg-white/20 rounded-sm"></div>
            </div>
          </div>
          <div className="text-xs text-erp-500 font-medium">&copy; 2024 Enterprise Resource Pro Inc.</div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-5/12 bg-white flex flex-col justify-center items-center p-8 lg:p-12 relative shadow-2xl z-20">
        <div className="absolute top-0 right-0 p-8">
          <div className="text-xs font-semibold text-erp-400">
            Need help?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </div>
        </div>

        <div className="w-full max-w-[360px] space-y-8 animate-in slide-in-from-right-8 duration-700">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Server className="text-white w-5 h-5" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-erp-900 tracking-tight">Welcome back</h2>
            <p className="text-sm text-erp-500 mt-2">Enter your credentials to access the workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-md text-xs font-medium flex items-center gap-2 animate-in slide-in-from-top-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-erp-700 uppercase tracking-wide ml-1">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-erp-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-10 border-erp-200 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent bg-white shadow-sm transition-all rounded-md text-sm"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-erp-700 uppercase tracking-wide">Password</label>
                  <button type="button" className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    Forgot?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-erp-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-10 border-erp-200 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent bg-white shadow-sm transition-all rounded-md text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0 rounded-md text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-erp-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-erp-400 font-medium">Quick Access</span>
            </div>
          </div>

          <button
            className="w-full group flex items-center justify-between p-3 rounded-lg border border-erp-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
            onClick={() => {
              setEmail("admin@erp.com");
              setPassword("admin");
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-erp-100 flex items-center justify-center text-erp-600 font-bold text-xs group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                JD
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-erp-900 group-hover:text-blue-900">Admin Demo</div>
                <div className="text-xs text-erp-500">Full Access</div>
              </div>
            </div>
            <div className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">AUTO FILL</div>
          </button>
        </div>
      </div>
    </div>
  );
};
