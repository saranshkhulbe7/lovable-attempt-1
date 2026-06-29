import { Suspense } from "react";
import { LoaderCircle } from "lucide-react";
import { useRoutes } from "react-router-dom";
import routes from "~react-pages";

function RouteFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08080b] text-zinc-100">
      <LoaderCircle className="size-5 animate-spin text-zinc-400" />
    </main>
  );
}

export function AppRouter() {
  const element = useRoutes(routes);

  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}
