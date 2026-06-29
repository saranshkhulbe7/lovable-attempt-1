import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMe } from "@/lib/auth";

export const currentUserQueryKey = ["auth", "me"] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getMe,
    retry: false,
    staleTime: 30_000,
  });
}

export function useRequireUser() {
  const navigate = useNavigate();
  const query = useCurrentUser();

  useEffect(() => {
    if (query.isError) {
      navigate("/login", { replace: true });
    }
  }, [navigate, query.isError]);

  return query;
}
