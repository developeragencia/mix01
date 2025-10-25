import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options?: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
  }
): Promise<Response> {
  const method = options?.method || "GET";
  const headers = options?.headers || {};
  
  if (options?.body && typeof options.body === "object") {
    headers["Content-Type"] = "application/json";
  }
  
  const body = options?.body && typeof options.body === "object" 
    ? JSON.stringify(options.body) 
    : options?.body;
  
  const res = await fetch(url, {
    method,
    headers,
    body,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include", // CRITICAL: Send cookies with every request
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false, // ⚡ Não refetch ao montar
      refetchOnReconnect: false, // ⚡ Não refetch ao reconectar
      staleTime: 5 * 60 * 1000, // ⚡ 5 minutos (ao invés de Infinity)
      gcTime: 10 * 60 * 1000, // ⚡ 10 minutos para garbage collection
      retry: 1, // ⚡ Tentar 1 vez ao invés de false
      retryDelay: 1000, // ⚡ Delay de 1 segundo
      // Remove deprecated onError - this causes unhandled rejections
    },
    mutations: {
      retry: false,
      // Remove deprecated onError - this causes unhandled rejections
    },
  },
});
