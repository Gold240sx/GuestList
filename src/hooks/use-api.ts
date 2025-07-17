"use client";

import { useAuth } from '@/context/auth-context';
import { useState } from 'react';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = async <T>(
    url: string,
    options: RequestInit = {},
    apiOptions: UseApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      // Get the current user's ID token
      const token = await user?.getIdToken();
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      const result: ApiResponse<T> = {
        success: true,
        data: data.data || data,
      };

      apiOptions.onSuccess?.(result.data);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      apiOptions.onError?.(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const get = <T>(url: string, options?: UseApiOptions) => 
    makeRequest<T>(url, { method: 'GET' }, options);

  const post = <T>(url: string, body: any, options?: UseApiOptions) => 
    makeRequest<T>(url, { 
      method: 'POST', 
      body: JSON.stringify(body) 
    }, options);

  const put = <T>(url: string, body: any, options?: UseApiOptions) => 
    makeRequest<T>(url, { 
      method: 'PUT', 
      body: JSON.stringify(body) 
    }, options);

  const del = <T>(url: string, options?: UseApiOptions) => 
    makeRequest<T>(url, { method: 'DELETE' }, options);

  return {
    loading,
    error,
    makeRequest,
    get,
    post,
    put,
    delete: del,
  };
} 