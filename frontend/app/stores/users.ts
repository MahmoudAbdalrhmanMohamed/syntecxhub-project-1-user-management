import { defineStore } from 'pinia';
import type {
  PaginationMeta,
  UserFormPayload,
  UserRecord,
  UserRole,
  UserStatus,
} from '#shared/types/api';

export const useUsersStore = defineStore('aegis-users', () => {
  const api = useApiClient();

  const items = ref<UserRecord[]>([]);
  const selectedUser = ref<UserRecord | null>(null);
  const meta = ref<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const filters = reactive({
    page: 1,
    limit: 8,
    search: '',
    role: '' as '' | UserRole,
    status: '' as '' | UserStatus,
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  const loading = ref(false);
  const submitting = ref(false);
  const error = ref<string | null>(null);

  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get<UserRecord[]>(
        '/users',
        {
          page: filters.page,
          limit: filters.limit,
          search: filters.search || undefined,
          role: filters.role || undefined,
          status: filters.status || undefined,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        },
        'users-list',
      );
      items.value = res.data || [];
      if (res.meta) {
        meta.value = res.meta;
      }
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === 'AbortError') return;
      error.value = api.extractApiErrorMessage(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchUserById = async (id: string) => {
    const res = await api.get<UserRecord>(`/users/${id}`);
    selectedUser.value = res.data;
    return res.data;
  };

  const createUser = async (payload: UserFormPayload) => {
    submitting.value = true;
    try {
      const res = await api.post<UserRecord>('/users', payload as unknown as Record<string, unknown>);
      await fetchUsers();
      return res.data;
    } finally {
      submitting.value = false;
    }
  };

  const updateUser = async (id: string, payload: Partial<UserFormPayload>) => {
    submitting.value = true;
    try {
      const res = await api.patch<UserRecord>(
        `/users/${id}`,
        payload as unknown as Record<string, unknown>,
      );
      await fetchUsers();
      return res.data;
    } finally {
      submitting.value = false;
    }
  };

  const deleteUser = async (id: string) => {
    submitting.value = true;
    try {
      await api.del(`/users/${id}`);
      if (items.value.length === 1 && filters.page > 1) {
        filters.page -= 1;
      }
      await fetchUsers();
    } finally {
      submitting.value = false;
    }
  };

  const resetFilters = () => {
    filters.page = 1;
    filters.search = '';
    filters.role = '';
    filters.status = '';
    filters.sortBy = 'createdAt';
    filters.sortOrder = 'desc';
    fetchUsers();
  };

  return {
    items,
    selectedUser,
    meta,
    filters,
    loading,
    submitting,
    error,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    resetFilters,
  };
});
