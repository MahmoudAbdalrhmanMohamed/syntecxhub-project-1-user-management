<script setup lang="ts">
import {
  UserPlus,
  Search,
  RotateCcw,
  Eye,
  Pencil,
  Trash2,
  X,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  Shield,
} from 'lucide-vue-next';
import { useDebounceFn } from '@vueuse/core';
import type { UserFormPayload, UserRecord } from '#shared/types/api';
import { userFormSchema } from '#shared/validation/schemas';

useSeoMeta({
  title: 'User Management',
  description: 'Directory administration, role assignments, and account status management.',
});

const usersStore = useUsersStore();
const toast = useToast();
const confirmDialog = useConfirm();
const { formatDate, formatDateTime } = useFormatters();
const { extractApiErrorMessage } = useApiClient();

await useAsyncData('users-directory', async () => {
  await usersStore.fetchUsers();
  return true;
});

const debouncedSearch = useDebounceFn(() => {
  usersStore.filters.page = 1;
  usersStore.fetchUsers();
}, 300);

const activeDepartment = ref('');

const selectDepartment = (dept: string) => {
  activeDepartment.value = dept === 'All Departments' ? '' : dept;
  usersStore.filters.search = activeDepartment.value;
  usersStore.filters.page = 1;
  usersStore.fetchUsers();
};

const handleFilterChange = () => {
  usersStore.filters.page = 1;
  usersStore.fetchUsers();
};

const handlePageChange = (nextPage: number) => {
  usersStore.filters.page = nextPage;
  usersStore.fetchUsers();
};

// Create / Edit Modal state
const isFormModalOpen = ref(false);
const editingUser = ref<UserRecord | null>(null);
const formErrors = ref<Record<string, string>>({});
const serverFormError = ref<string | null>(null);

const formState = reactive<UserFormPayload>({
  fullName: '',
  email: '',
  phoneNumber: '',
  avatar: '',
  role: 'viewer',
  status: 'active',
  department: 'Platform Engineering',
  jobTitle: 'Software Engineer',
});

const openCreateModal = () => {
  editingUser.value = null;
  formErrors.value = {};
  serverFormError.value = null;
  formState.fullName = '';
  formState.email = '';
  formState.phoneNumber = '+20 100 ';
  formState.avatar = '';
  formState.role = 'editor';
  formState.status = 'active';
  formState.department = 'Platform Engineering';
  formState.jobTitle = 'Systems Engineer';
  isFormModalOpen.value = true;
};

const openEditModal = (user: UserRecord) => {
  editingUser.value = user;
  formErrors.value = {};
  serverFormError.value = null;
  formState.fullName = user.fullName;
  formState.email = user.email;
  formState.phoneNumber = user.phoneNumber;
  formState.avatar = user.avatar || '';
  formState.role = user.role;
  formState.status = user.status;
  formState.department = user.department || 'Operations';
  formState.jobTitle = user.jobTitle || 'Specialist';
  isFormModalOpen.value = true;
};

const handleSubmitUser = async () => {
  formErrors.value = {};
  serverFormError.value = null;

  const parsed = userFormSchema.safeParse(formState);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] || 'form');
      if (!fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    formErrors.value = fieldErrors;
    return;
  }

  try {
    if (editingUser.value) {
      await usersStore.updateUser(editingUser.value._id, parsed.data);
      toast.success(
        'User Updated',
        `${parsed.data.fullName}'s profile has been updated.`,
      );
    } else {
      await usersStore.createUser(parsed.data);
      toast.success(
        'User Created',
        `${parsed.data.fullName} has been added to the directory.`,
      );
    }
    isFormModalOpen.value = false;
  } catch (err: unknown) {
    const msg = extractApiErrorMessage(err);
    serverFormError.value = msg;
    toast.error('Unable to Save User', msg);
  }
};

// Details Drawer state
const inspectedUser = ref<UserRecord | null>(null);
const openDetailsDrawer = (user: UserRecord) => {
  inspectedUser.value = user;
};

// Delete User with Confirmation
const handleDeleteUser = async (user: UserRecord) => {
  const confirmed = await confirmDialog.ask({
    title: 'Delete User Account',
    message: `Are you sure you want to permanently remove "${user.fullName}" (${user.email}) from the organization directory? This action cannot be undone.`,
    confirmLabel: 'Delete User',
    variant: 'danger',
  });

  if (!confirmed) return;

  try {
    await usersStore.deleteUser(user._id);
    if (inspectedUser.value?._id === user._id) {
      inspectedUser.value = null;
    }
    toast.success('User Deleted', `${user.fullName} was removed from MongoDB.`);
  } catch (err: unknown) {
    toast.error('Deletion Failed', extractApiErrorMessage(err));
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Top Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Organization User Directory
        </h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage operator accounts, role-based access levels, and onboarding status.
        </p>
      </div>
      <button type="button" class="btn-primary" @click="openCreateModal">
        <UserPlus class="h-4 w-4" />
        Add New User
      </button>
    </div>

    <!-- Department Filter Tabs Ribbon (Enterprise Workspace Pattern) -->
    <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 select-none">
      <button
        v-for="dept in ['All Departments', 'Engineering', 'Product', 'Design', 'Operations', 'Security']"
        :key="dept"
        type="button"
        class="rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer border border-transparent"
        :class="
          (dept === 'All Departments' && !activeDepartment) || activeDepartment === dept
            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
            : 'text-slate-600 dark:text-slate-400 hover:text-indigo-400 hover:bg-indigo-950/40 border-slate-200 dark:border-indigo-950/60'
        "
        @click="selectDepartment(dept)"
      >
        {{ dept }}
      </button>
    </div>

    <!-- Filter & Search Controls -->
    <div class="surface-card p-4">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div class="relative lg:col-span-2">
          <Search
            class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <input
            v-model="usersStore.filters.search"
            type="search"
            placeholder="Search by name, email, phone, or department..."
            class="input-field pl-10"
            @input="debouncedSearch"
          />
        </div>

        <UiCustomSelect
          v-model="usersStore.filters.role"
          :options="[
            { label: 'All Roles', value: '' },
            { label: 'Admin', value: 'admin' },
            { label: 'Manager', value: 'manager' },
            { label: 'Editor', value: 'editor' },
            { label: 'Viewer', value: 'viewer' },
          ]"
          placeholder="All Roles"
          theme="indigo"
          class="w-full sm:w-40"
          @change="handleFilterChange"
        />

        <UiCustomSelect
          v-model="usersStore.filters.status"
          :options="[
            { label: 'All Statuses', value: '' },
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Suspended', value: 'suspended' },
          ]"
          placeholder="All Statuses"
          theme="indigo"
          class="w-full sm:w-40"
          @change="handleFilterChange"
        />

        <div class="flex items-center gap-2">
          <UiCustomSelect
            v-model="usersStore.filters.sortBy"
            :options="[
              { label: 'Newest Joined', value: 'createdAt' },
              { label: 'Name (A–Z)', value: 'fullName' },
              { label: 'Role', value: 'role' },
              { label: 'Status', value: 'status' },
            ]"
            theme="indigo"
            class="w-full sm:w-44"
            @change="handleFilterChange"
          />
          <button
            type="button"
            class="btn-secondary shrink-0 px-3"
            title="Reset Filters"
            @click="usersStore.resetFilters"
          >
            <RotateCcw class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Users Listing Table -->
    <div class="surface-card overflow-hidden">
      <UiTableSkeleton v-if="usersStore.loading" :rows="6" :columns="6" />

      <div
        v-else-if="usersStore.error"
        class="p-8 text-center space-y-3"
      >
        <p class="text-sm font-semibold text-rose-500">{{ usersStore.error }}</p>
        <button type="button" class="btn-secondary" @click="usersStore.fetchUsers()">
          Retry Request
        </button>
      </div>

      <div v-else-if="usersStore.items.length === 0" class="p-6">
        <UiEmptyState
          title="No matching users found"
          description="No user records matched your current search or filter criteria. Try resetting filters or adding a new team member."
          action-label="Add New User"
          @action="openCreateModal"
        />
      </div>

      <div v-else class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              <th class="px-5 py-3.5">User</th>
              <th class="px-4 py-3.5">Department &amp; Title</th>
              <th class="px-4 py-3.5">Role</th>
              <th class="px-4 py-3.5">Status</th>
              <th class="px-4 py-3.5">Phone</th>
              <th class="px-4 py-3.5">Registered</th>
              <th class="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-800/80 text-sm">
            <tr
              v-for="user in usersStore.items"
              :key="user._id"
              class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <img
                    :src="user.avatar"
                    :alt="user.fullName"
                    class="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                  />
                  <div class="min-w-0">
                    <button
                      type="button"
                      class="font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-500 text-left truncate block"
                      @click="openDetailsDrawer(user)"
                    >
                      {{ user.fullName }}
                    </button>
                    <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {{ user.email }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-4 py-3.5">
                <p class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {{ user.department || 'Operations' }}
                </p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  {{ user.jobTitle || 'Specialist' }}
                </p>
              </td>

              <td class="px-4 py-3.5">
                <span
                  class="inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold capitalize"
                  :class="{
                    'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20':
                      user.role === 'admin',
                    'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20':
                      user.role === 'manager',
                    'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20':
                      user.role === 'editor',
                    'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20':
                      user.role === 'viewer',
                  }"
                >
                  {{ user.role }}
                </span>
              </td>

              <td class="px-4 py-3.5">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                  :class="{
                    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400':
                      user.status === 'active',
                    'bg-amber-500/10 text-amber-600 dark:text-amber-400':
                      user.status === 'inactive',
                    'bg-rose-500/10 text-rose-600 dark:text-rose-400':
                      user.status === 'suspended',
                  }"
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full"
                    :class="{
                      'bg-emerald-500': user.status === 'active',
                      'bg-amber-500': user.status === 'inactive',
                      'bg-rose-500': user.status === 'suspended',
                    }"
                  />
                  {{ user.status }}
                </span>
              </td>

              <td class="px-4 py-3.5 font-mono text-xs text-slate-600 dark:text-slate-400">
                {{ user.phoneNumber }}
              </td>

              <td class="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                {{ formatDate(user.createdAt) }}
              </td>

              <td class="px-5 py-3.5 text-right">
                <div class="inline-flex items-center justify-end gap-1">
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500"
                    title="Inspect User Details"
                    @click="openDetailsDrawer(user)"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-500"
                    title="Edit User"
                    @click="openEditModal(user)"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-500"
                    title="Delete User"
                    @click="handleDeleteUser(user)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <UiPaginationBar
        v-if="usersStore.items.length > 0"
        :meta="usersStore.meta"
        @change="handlePageChange"
      />
    </div>

    <!-- Create / Edit User Modal -->
    <Teleport to="body">
      <div
        v-if="isFormModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      >
        <div class="surface-card w-full max-w-lg overflow-hidden shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">
              {{ editingUser ? 'Edit User Account' : 'Create New User Account' }}
            </h3>
            <button
              type="button"
              class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              @click="isFormModalOpen = false"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <form class="p-6 space-y-4" @submit.prevent="handleSubmitUser">
            <div
              v-if="serverFormError"
              class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-500"
            >
              {{ serverFormError }}
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  v-model="formState.fullName"
                  type="text"
                  placeholder="e.g. Nadia El-Masry"
                  class="input-field"
                />
                <p v-if="formErrors.fullName" class="mt-1 text-xs text-rose-500">
                  {{ formErrors.fullName }}
                </p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work Email *
                </label>
                <input
                  v-model="formState.email"
                  type="email"
                  placeholder="name@aegisauth.io"
                  class="input-field"
                />
                <p v-if="formErrors.email" class="mt-1 text-xs text-rose-500">
                  {{ formErrors.email }}
                </p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number *
                </label>
                <input
                  v-model="formState.phoneNumber"
                  type="text"
                  placeholder="+20 100 512 8400"
                  class="input-field"
                />
                <p v-if="formErrors.phoneNumber" class="mt-1 text-xs text-rose-500">
                  {{ formErrors.phoneNumber }}
                </p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <input
                  v-model="formState.department"
                  type="text"
                  placeholder="Platform Engineering"
                  class="input-field"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Job Title
                </label>
                <input
                  v-model="formState.jobTitle"
                  type="text"
                  placeholder="Staff Systems Architect"
                  class="input-field"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role *
                </label>
                <UiCustomSelect
                  v-model="formState.role"
                  :options="[
                    { label: 'Admin', value: 'admin' },
                    { label: 'Manager', value: 'manager' },
                    { label: 'Editor', value: 'editor' },
                    { label: 'Viewer', value: 'viewer' },
                  ]"
                  placeholder="Select Role"
                  theme="indigo"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Account Status *
                </label>
                <UiCustomSelect
                  v-model="formState.status"
                  :options="[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                    { label: 'Suspended', value: 'suspended' },
                  ]"
                  placeholder="Select Status"
                  theme="indigo"
                />
              </div>

              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Avatar URL (Optional)
                </label>
                <input
                  v-model="formState.avatar"
                  type="text"
                  placeholder="Leave blank to auto-generate enterprise initials avatar"
                  class="input-field"
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
              <button
                type="button"
                class="btn-secondary"
                @click="isFormModalOpen = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn-primary"
                :disabled="usersStore.submitting"
              >
                {{
                  usersStore.submitting
                    ? 'Saving...'
                    : editingUser
                      ? 'Save Changes'
                      : 'Create User'
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- User Details Slide-Over Drawer -->
    <Teleport to="body">
      <div
        v-if="inspectedUser"
        class="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs"
        @click.self="inspectedUser = null"
      >
        <div
          class="h-full w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between shadow-2xl"
        >
          <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 class="text-base font-bold text-slate-900 dark:text-white">
                User Profile Inspection
              </h3>
              <button
                type="button"
                class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                @click="inspectedUser = null"
              >
                <X class="h-4 w-4" />
              </button>
            </div>

            <div class="flex items-center gap-4">
              <img
                :src="inspectedUser.avatar"
                :alt="inspectedUser.fullName"
                class="h-16 w-16 rounded-2xl object-cover ring-2 ring-sky-500/30"
              />
              <div>
                <h4 class="text-lg font-bold text-slate-900 dark:text-white">
                  {{ inspectedUser.fullName }}
                </h4>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ inspectedUser.jobTitle }} • {{ inspectedUser.department }}
                </p>
                <div class="mt-2 flex items-center gap-2">
                  <span class="rounded bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 text-[11px] font-semibold uppercase text-sky-500">
                    {{ inspectedUser.role }}
                  </span>
                  <span class="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold uppercase text-emerald-500">
                    {{ inspectedUser.status }}
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-4 text-xs">
              <div class="flex items-center justify-between py-1.5 border-b border-slate-200/70 dark:border-slate-800/70">
                <span class="flex items-center gap-2 text-slate-500">
                  <Mail class="h-3.5 w-3.5" /> Email
                </span>
                <span class="font-medium text-slate-900 dark:text-slate-100">
                  {{ inspectedUser.email }}
                </span>
              </div>
              <div class="flex items-center justify-between py-1.5 border-b border-slate-200/70 dark:border-slate-800/70">
                <span class="flex items-center gap-2 text-slate-500">
                  <Phone class="h-3.5 w-3.5" /> Phone
                </span>
                <span class="font-mono text-slate-900 dark:text-slate-100">
                  {{ inspectedUser.phoneNumber }}
                </span>
              </div>
              <div class="flex items-center justify-between py-1.5 border-b border-slate-200/70 dark:border-slate-800/70">
                <span class="flex items-center gap-2 text-slate-500">
                  <Building2 class="h-3.5 w-3.5" /> Department
                </span>
                <span class="font-medium text-slate-900 dark:text-slate-100">
                  {{ inspectedUser.department }}
                </span>
              </div>
              <div class="flex items-center justify-between py-1.5 border-b border-slate-200/70 dark:border-slate-800/70">
                <span class="flex items-center gap-2 text-slate-500">
                  <Briefcase class="h-3.5 w-3.5" /> Title
                </span>
                <span class="font-medium text-slate-900 dark:text-slate-100">
                  {{ inspectedUser.jobTitle }}
                </span>
              </div>
              <div class="flex items-center justify-between py-1.5 border-b border-slate-200/70 dark:border-slate-800/70">
                <span class="flex items-center gap-2 text-slate-500">
                  <Calendar class="h-3.5 w-3.5" /> Created
                </span>
                <span class="font-mono text-slate-900 dark:text-slate-100">
                  {{ formatDateTime(inspectedUser.createdAt) }}
                </span>
              </div>
              <div class="flex items-center justify-between py-1.5">
                <span class="flex items-center gap-2 text-slate-500">
                  <Shield class="h-3.5 w-3.5" /> ObjectId
                </span>
                <span class="font-mono text-[11px] text-slate-500">
                  {{ inspectedUser._id }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
            <button
              type="button"
              class="btn-secondary flex-1"
              @click="
                openEditModal(inspectedUser!);
                inspectedUser = null;
              "
            >
              <Pencil class="h-4 w-4" />
              Edit Profile
            </button>
            <button
              type="button"
              class="btn-danger"
              @click="handleDeleteUser(inspectedUser!)"
            >
              <Trash2 class="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
