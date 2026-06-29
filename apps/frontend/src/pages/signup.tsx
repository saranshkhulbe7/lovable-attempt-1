import { AuthCard } from "@/components/auth/auth-card";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function SignupPage() {
  return (
    <AuthLayout>
      <AuthCard mode="signup" />
    </AuthLayout>
  );
}
