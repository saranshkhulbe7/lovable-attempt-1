import { useState } from "react";
import axios from "axios";
import { ArrowRight, Sparkles } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { currentUserQueryKey } from "@/hooks/use-current-user";
import { login, signup } from "@/lib/auth";

import { Button } from "@lovable/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lovable/ui/components/card";
import { Input } from "@lovable/ui/components/input";
import { Label } from "@lovable/ui/components/label";

type AuthMode = "login" | "signup";

const modeCopy = {
  login: {
    title: "Welcome back",
    description: "Log in to your workspace.",
    button: "Log in",
    success: "Logged in",
    alternateLabel: "New here?",
    alternateAction: "Create account",
    alternateHref: "/signup",
  },
  signup: {
    title: "Create your account",
    description: "Start a Lovable-style workspace.",
    button: "Create account",
    success: "Account created",
    alternateLabel: "Already have an account?",
    alternateAction: "Log in",
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

  return "Authentication failed";
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
    <Card className="w-full max-w-md rounded-lg border-white/10 bg-[#101014]/90 py-7 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
      <CardHeader className="space-y-5 px-7">
        <span className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white text-black">
          <Sparkles className="size-4" />
        </span>

        <div>
          <CardTitle className="text-2xl text-white">{copy.title}</CardTitle>
          <CardDescription className="mt-2 text-zinc-400">
            {copy.description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-7">
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">
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
              className="h-11 border-white/10 bg-black/30 text-white placeholder:text-zinc-600 focus-visible:border-fuchsia-300/50 focus-visible:ring-fuchsia-300/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">
              Password
            </Label>
            <Input
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              type="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              minLength={8}
              required
              className="h-11 border-white/10 bg-black/30 text-white placeholder:text-zinc-600 focus-visible:border-fuchsia-300/50 focus-visible:ring-fuchsia-300/20"
            />
          </div>

          <Button
            className="h-11 w-full bg-white text-black hover:bg-zinc-200"
            disabled={loading}
          >
            {loading ? "Please wait..." : copy.button}
            {!loading && <ArrowRight className="size-4" />}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          {copy.alternateLabel}{" "}
          <Link
            to={copy.alternateHref}
            className="font-medium text-zinc-100 underline-offset-4 hover:underline"
          >
            {copy.alternateAction}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
