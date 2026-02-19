'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect, ReactNode } from 'react';
import { AuthProvider } from '@/store/auth-context';
import { initTenant } from '@/services/api';

export function Providers({ children }: { children: ReactNode }) {
  // Inicializa o tenantId no localStorage uma vez, antes do primeiro login.
  // Lê NEXT_PUBLIC_TENANT_SLUG e faz GET /tenants/slug/:slug para obter o UUID.
  useEffect(() => {
    initTenant();
  }, []);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
