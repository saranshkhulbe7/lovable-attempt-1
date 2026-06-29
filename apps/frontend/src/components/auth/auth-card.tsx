import { useState } from "react";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Wordmark } from "@/components/logo";
import { currentUserQueryKey } from "@/hooks/use-current-user";
import { login, signup } from "@/lib/auth";

import { Button } from "@lovable/ui/components/button";
import { Input } from "@lovable/ui/components/input";
import { Label } from "@lovable/ui/components/label";

type AuthMode = "login" | "signup";

const modeCopy = {
  login: {
    title: "Sign in",
    description: "Pick up where you left off.",
    button: "Sign in",
    success: "Signed in",
    alternateLabel: "New here?",
    alternateAction: "Create an account",
    alternateHref: "/signup",
  },
  signup: {
    title: "Create your account",
    description: "Start organizing work into projects and conversations.",
    button: "Create account",
    success: "Account created",
    alternateLabel: "Already have an account?",
    alternateAction: "Sign in",
    alternateHref: "/login",
  },
} satisfies Record<AuthMode, Record<string, string>>;

function getErrorMessage(error: unknown) {
  if (
    axios.isAxiosError(error) &&
    typeof error.response?.data?.message === "string"
  ) {
    return error.response.data.message;
  }

  return "Something went wrong. Try again.";
}

export function AuthCard({ mode }: { mode: AuthMode }) {
  const copy = modeCopy[mode];
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const credentials = { email, password };
      await (mode === "signup" ? signup(credentials) : login(credentials));

      await queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
      toast.success(copy.success);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Wordmark className="mb-12 lg:hidden" />

      <header className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          {copy.title}
        </h1>
        <p className="text-sm text-muted-foreground">{copy.description}</p>
      </header>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-foreground">
            Email
          </Label>
          <Input
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="password" className="text-sm text-foreground">
              Password
            </Label>
            {mode === "signup" && (
              <span className="font-mono text-xs text-muted-foreground">
                8+ characters
              </span>
            )}
          </div>
          <Input
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            minLength={8}
            required
            className="h-11"
          />
        </div>

        <Button type="submit" className="group h-11 w-full" disabled={loading}>
          {loading ? "Please wait…" : copy.button}
          {!loading && (
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </Button>
      </form>

      <p className="mt-8 text-sm text-muted-foreground">
        {copy.alternateLabel}{" "}
        <Link
          to={copy.alternateHref}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {copy.alternateAction}
        </Link>
      </p>
    </div>
  );
}
