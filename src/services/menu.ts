import request from '@/utils/request';

export async function queryMenu(): Promise<any> {
  return request('/api/menu');
}
