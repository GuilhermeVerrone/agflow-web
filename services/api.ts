import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

/**
 * Chave usada para persistir o tenantId resolvido via slug.
 * Definir NEXT_PUBLIC_TENANT_SLUG no .env.local para identificar
 * o tenant desta instalação frontend (ex: "agflow-test").
 * O tenantId real (UUID) é buscado uma vez via GET /tenants/slug/:slug
 * e cacheado no localStorage.
 */
export const TENANT_STORAGE_KEY = 'tenant_id';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor: adiciona JWT token e X-Tenant-Id automaticamente
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Tenant: prioridade localStorage > user.tenantId (pós-login)
        const tenantId = this.getTenantId();
        if (tenantId && config.headers) {
          config.headers['x-tenant-id'] = tenantId;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: trata erros globalmente
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  /**
   * Retorna o tenantId na ordem de prioridade:
   * 1. Chave separada 'tenant_id' (inicializada via initTenant())
   * 2. user.tenantId no localStorage (disponível pós-login)
   */
  private getTenantId(): string | null {
    if (typeof window === 'undefined') return null;

    const direct = localStorage.getItem(TENANT_STORAGE_KEY);
    if (direct) return direct;

    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        return parsed.tenantId || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  private clearToken() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    // Não remove o tenant_id — ele é da instalação, não do usuário
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().getInstance();

/**
 * Inicializa o tenant para esta instalação frontend.
 * Deve ser chamado no _app.tsx / providers.tsx antes do primeiro login.
 *
 * - Se NEXT_PUBLIC_TENANT_SLUG estiver definido, busca o UUID via API
 *   e armazena em localStorage uma única vez.
 * - Se já estiver no localStorage, não refaz a chamada.
 *
 * @example
 * // providers.tsx
 * useEffect(() => { initTenant(); }, []);
 */
export async function initTenant(): Promise<void> {
  if (typeof window === 'undefined') return;

  // Já inicializado
  if (localStorage.getItem(TENANT_STORAGE_KEY)) return;

  const slug = process.env.NEXT_PUBLIC_TENANT_SLUG;
  if (!slug) {
    console.warn('[AgFlow] NEXT_PUBLIC_TENANT_SLUG não definido — X-Tenant-Id não será enviado no login.');
    return;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/tenants/slug/${slug}`);
    if (!res.ok) throw new Error(`Tenant "${slug}" não encontrado`);
    const data = await res.json();
    localStorage.setItem(TENANT_STORAGE_KEY, data.id);
  } catch (err) {
    console.error('[AgFlow] Falha ao inicializar tenant:', err);
  }
}
