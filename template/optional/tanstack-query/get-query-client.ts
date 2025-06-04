import { QueryClient } from '@tanstack/react-query';

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (!browserQueryClient) browserQueryClient = new QueryClient();

  return browserQueryClient;
}
