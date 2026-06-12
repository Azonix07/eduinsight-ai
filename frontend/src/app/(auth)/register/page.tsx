"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  EyeOff,
  Loader2,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Building2,
  UserCircle,
  Mail,
  Lock,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import type { UserRole } from "@/stores/auth-store";

const ROLES: { value: UserRole; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: "school_admin",
    label: "School Admin",
    icon: <Building2 className="h-5 w-5" />,
    description: "Manage your school and staff",
  },
  {
    value: "teacher",
    label: "Teacher / Staff",
    icon: <UserCircle className="h-5 w-5" />,
    description: "Evaluate and manage students",
  },
  {
    value: "student",
    label: "Student",
    icon: <GraduationCap className="h-5 w-5" />,
    description: "Track your performance",
  },
  {
    value: "parent",
    label: "Parent",
    icon: <UserCircle className="h-5 w-5" />,
    description: "Monitor your child's progress",
  },
];

const STEPS = ["role", "info", "credentials"] as const;
type Step = (typeof STEPS)[number];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("role");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "" as UserRole | "",
    firstName: "",
    lastName: "",
    schoolCode: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const stepIndex = STEPS.indexOf(currentStep);

  const handleNext = () => {
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) setCurrentStep(STEPS[idx + 1]);
  };

  const handleBack = () => {
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) setCurrentStep(STEPS[idx - 1]);
  };

  const canProceed = () => {
    switch (currentStep) {
      case "role":
        return formData.role !== "";
      case "info":
        return formData.firstName.trim() !== "" && formData.lastName.trim() !== "";
      case "credentials":
        return (
          formData.email.trim() !== "" &&
          formData.password.length >= 8 &&
          formData.password === formData.confirmPassword
        );
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceed()) return;

    setIsLoading(true);
    try {
      await apiClient.post("/auth/register", {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        schoolCode: formData.schoolCode || undefined,
      });

      toast.success("Account created!", {
        description: "Please check your email to verify your account.",
      });
      router.push("/login");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Registration failed. Please try again.";
      toast.error("Registration failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg"
    >
      <Card className="glass-strong shadow-premium border-0">
        <CardHeader className="text-center pb-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand"
          >
            <GraduationCap className="h-7 w-7 text-white" />
          </motion.div>
          <CardTitle className="text-2xl font-heading font-bold">
            Create your account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Join EduInsight AI and transform education
          </CardDescription>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                    i < stepIndex
                      ? "gradient-brand text-white"
                      : i === stepIndex
                      ? "border-2 border-brand text-brand"
                      : "border-2 border-muted text-muted-foreground"
                  }`}
                >
                  {i < stepIndex ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-8 rounded-full transition-colors duration-300 ${
                      i < stepIndex ? "bg-brand" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Role Selection */}
              {currentStep === "role" && (
                <motion.div
                  key="role"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <p className="text-sm font-medium text-muted-foreground mb-4">
                    Select your role
                  </p>
                  {ROLES.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, role: role.value }))
                      }
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${
                        formData.role === role.value
                          ? "border-brand bg-brand/5 shadow-sm"
                          : "border-border hover:border-brand/30 hover:bg-accent/50"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                          formData.role === role.value
                            ? "gradient-brand text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {role.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{role.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {role.description}
                        </p>
                      </div>
                      {formData.role === role.value && (
                        <Check className="h-5 w-5 text-brand ml-auto" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Step 2: Personal Info */}
              {currentStep === "info" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="register-firstName">First Name</Label>
                      <Input
                        id="register-firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-lastName">Last Name</Label>
                      <Input
                        id="register-lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-schoolCode">
                      School Code{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                      id="register-schoolCode"
                      placeholder="Enter your school code"
                      value={formData.schoolCode}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          schoolCode: e.target.value,
                        }))
                      }
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">
                      Ask your school administrator for the code
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Credentials */}
              {currentStep === "credentials" && (
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="you@school.edu"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                        autoComplete="email"
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        required
                        minLength={8}
                        autoComplete="new-password"
                        className="h-11 pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirmPassword">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        required
                        autoComplete="new-password"
                        className="h-11 pl-10"
                      />
                    </div>
                    {formData.confirmPassword &&
                      formData.password !== formData.confirmPassword && (
                        <p className="text-xs text-destructive">
                          Passwords do not match
                        </p>
                      )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6 gap-3">
              {stepIndex > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="h-11"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep === "credentials" ? (
                <Button
                  id="register-submit"
                  type="submit"
                  disabled={isLoading || !canProceed()}
                  className="h-11 gradient-brand text-white font-medium hover:opacity-90 transition-opacity"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="h-11 gradient-brand text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-brand hover:text-brand/80 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
