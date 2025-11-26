import { useState } from "react";
import { Link } from "wouter";
import { Building2, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password reset:", { password, confirmPassword });
  };

  const passwordStrength = password.length > 0 ? Math.min((password.length / 12) * 100, 100) : 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <a className="inline-flex items-center gap-2 mb-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-serif font-bold text-2xl">VenGrow</span>
            </a>
          </Link>
          <p className="text-muted-foreground">Create a new password</p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="font-serif font-bold text-2xl">Reset Password</h1>
              <p className="text-sm text-muted-foreground">
                Enter your new password below
              </p>
            </div>

            <div className="space-y-4">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="input-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="space-y-1">
                    <Progress value={passwordStrength} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Password strength: {passwordStrength < 50 ? "Weak" : passwordStrength < 80 ? "Medium" : "Strong"}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="pl-10 pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    data-testid="input-confirm-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-testid="button-toggle-confirm-password"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-destructive">Passwords do not match</p>
                )}
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 space-y-1">
              <p className="text-xs font-medium">Password requirements:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <div className={`h-1 w-1 rounded-full ${password.length >= 8 ? 'bg-green-600' : 'bg-muted-foreground'}`} />
                  At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <div className={`h-1 w-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-600' : 'bg-muted-foreground'}`} />
                  One uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <div className={`h-1 w-1 rounded-full ${/[0-9]/.test(password) ? 'bg-green-600' : 'bg-muted-foreground'}`} />
                  One number
                </li>
              </ul>
            </div>

            <Button type="submit" className="w-full" data-testid="button-reset-password">
              Reset Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
