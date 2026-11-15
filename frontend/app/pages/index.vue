<script setup lang="ts">
import { Users, UserCheck, UserX, Building2, RefreshCw, ArrowUpRight, Clock } from 'lucide-vue-next';

useSeoMeta({
  title: 'User Directory Analytics — Project 1',
  description: 'Executive overview of organization users, role distribution, and account status telemetry.',
});

const dashboardStore = useDashboardStore();
const { formatDateTime } = useFormatters();

await useAsyncData('project1-dashboard', async () => {
  await dashboardStore.fetchDashboardData();
  return true;
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Project 1: User Directory Analytics
        </h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Real-time user registration metrics, role distribution, and account status breakdown.
        </p>
      </div>
      <div class="flex items-center gap-2.5">
        <button type="button" class="btn-secondary" @click="dashboardStore.fetchDashboardData()">
          <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': dashboardStore.loading }" />
          Refresh
        </button>
        <NuxtLink to="/users" class="btn-primary">
          Open User Directory
          <ArrowUpRight class="h-4 w-4" />
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="surface-card p-5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Users</span>
          <Users class="h-4 w-4 text-sky-500" />
        </div>
        <p class="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
          {{ (dashboardStore.stats?.summary as any)?.totalUsers ?? 0 }}
        </p>
      </div>
      <div class="surface-card p-5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Accounts</span>
          <UserCheck class="h-4 w-4 text-emerald-500" />
        </div>
        <p class="mt-3 text-2xl font-bold text-emerald-500">
          {{ (dashboardStore.stats?.summary as any)?.activeUsers ?? 0 }}
        </p>
      </div>
      <div class="surface-card p-5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Suspended / Inactive</span>
          <UserX class="h-4 w-4 text-rose-500" />
        </div>
        <p class="mt-3 text-2xl font-bold text-rose-500">
          {{ ((dashboardStore.stats?.summary as any)?.inactiveUsers ?? 0) + ((dashboardStore.stats?.summary as any)?.suspendedUsers ?? 0) }}
        </p>
      </div>
      <div class="surface-card p-5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Departments</span>
          <Building2 class="h-4 w-4 text-indigo-500" />
        </div>
        <p class="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
          {{ (dashboardStore.stats?.summary as any)?.totalDepartments ?? 0 }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="surface-card p-5">
        <h3 class="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
          Recent User Registrations
        </h3>
        <div class="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
          <div
            v-for="u in dashboardStore.stats?.recent.users || []"
            :key="u._id"
            class="flex items-center justify-between py-3"
          >
            <div class="flex items-center gap-3">
              <img :src="u.avatar" :alt="u.fullName" class="h-8 w-8 rounded-full" />
              <div>
                <p class="text-xs font-semibold text-slate-900 dark:text-white">{{ u.fullName }}</p>
                <p class="text-[11px] text-slate-500">{{ u.email }}</p>
              </div>
            </div>
            <span class="rounded bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-sky-500">
              {{ u.role }}
            </span>
          </div>
        </div>
      </div>

      <div class="surface-card p-5">
        <h3 class="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
          Directory Activity Stream
        </h3>
        <div class="mt-4 space-y-3">
          <div v-for="item in dashboardStore.activity" :key="item.id" class="text-xs border-l-2 border-sky-500 pl-3">
            <p class="font-semibold text-slate-900 dark:text-white">{{ item.title }}</p>
            <p class="text-slate-500">{{ item.subtitle }}</p>
            <p class="font-mono text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
              <Clock class="h-3 w-3" /> {{ formatDateTime(item.timestamp) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
