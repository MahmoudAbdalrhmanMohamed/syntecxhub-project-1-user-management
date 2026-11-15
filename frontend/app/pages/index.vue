<script setup lang="ts">
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  RefreshCw,
  ArrowUpRight,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Layers,
} from 'lucide-vue-next';

useSeoMeta({
  title: 'Workforce Directory — Syntecxhub Identity',
  description: 'Enterprise directory analytics, role governance, and identity telemetry.',
});

const dashboardStore = useDashboardStore();
const { formatDateTime } = useFormatters();

await useAsyncData('project1-dashboard', async () => {
  await dashboardStore.fetchDashboardData();
  return true;
});

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';
    case 'manager':
      return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
    case 'editor':
      return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20';
    default:
      return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700';
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- IAM Executive Header Banner -->
    <div class="relative overflow-hidden rounded-2xl border border-indigo-200/80 dark:border-indigo-950/80 bg-gradient-to-r from-indigo-900/20 via-indigo-600/10 to-transparent p-6 sm:p-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-semibold">
            <ShieldCheck class="h-3.5 w-3.5 text-indigo-500" />
            <span>SYNTECXHUB IDENTITY // ACCESS GOVERNANCE</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Organization User Directory
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            Centralized role-based access control, active session telemetry, and department roster across your enterprise infrastructure.
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <button type="button" class="btn-secondary" @click="dashboardStore.fetchDashboardData()">
            <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': dashboardStore.loading }" />
            Sync Metrics
          </button>
          <NuxtLink to="/users" class="btn-primary">
            <span>Manage Directory</span>
            <ArrowUpRight class="h-4 w-4" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Metric Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="surface-card p-5 group">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Workforce</span>
          <div class="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Users class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {{ (dashboardStore.stats?.summary as any)?.totalUsers ?? 0 }}
        </p>
        <p class="mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
          <Sparkles class="h-3 w-3" /> Managed Directory Accounts
        </p>
      </div>

      <div class="surface-card p-5 group">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Operators</span>
          <div class="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <UserCheck class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
          {{ (dashboardStore.stats?.summary as any)?.activeUsers ?? 0 }}
        </p>
        <p class="mt-1 text-xs text-emerald-600/80 font-medium">
          Zero-Trust Compliant
        </p>
      </div>

      <div class="surface-card p-5 group">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending / Suspended</span>
          <div class="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <UserX class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">
          {{ ((dashboardStore.stats?.summary as any)?.inactiveUsers ?? 0) + ((dashboardStore.stats?.summary as any)?.suspendedUsers ?? 0) }}
        </p>
        <p class="mt-1 text-xs text-rose-600/80 font-medium">
          Requires Action
        </p>
      </div>

      <div class="surface-card p-5 group">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Departments</span>
          <div class="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Building2 class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {{ (dashboardStore.stats?.summary as any)?.totalDepartments ?? 0 }}
        </p>
        <p class="mt-1 text-xs text-purple-600 dark:text-purple-400 font-medium">
          Active Cost Centers
        </p>
      </div>
    </div>

    <!-- Split Grid: Recent Members and Activity Stream -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Team Directory Feed -->
      <div class="surface-card p-6">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-indigo-950/60 pb-4">
          <div class="flex items-center gap-2.5">
            <div class="h-2 w-2 rounded-full bg-indigo-500" />
            <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recent Team Onboarding
            </h3>
          </div>
          <NuxtLink to="/users" class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
            View All
          </NuxtLink>
        </div>

        <div class="mt-4 divide-y divide-slate-100 dark:divide-slate-800/60">
          <div
            v-for="u in dashboardStore.stats?.recent.users || []"
            :key="u._id"
            class="flex items-center justify-between py-3.5 hover:bg-slate-50/50 dark:hover:bg-indigo-950/20 rounded-xl px-2 transition-colors"
          >
            <div class="flex items-center gap-3 min-w-0">
              <img
                :src="u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.fullName)}`"
                :alt="u.fullName"
                class="h-9 w-9 rounded-full ring-2 ring-indigo-500/20 shrink-0"
              />
              <div class="min-w-0">
                <p class="text-xs font-semibold text-slate-900 dark:text-white truncate">{{ u.fullName }}</p>
                <p class="text-[11px] text-slate-500 truncate">{{ u.email }}</p>
              </div>
            </div>

            <span class="rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider" :class="getRoleBadgeClass(u.role)">
              {{ u.role }}
            </span>
          </div>
        </div>
      </div>

      <!-- IAM Audit Log -->
      <div class="surface-card p-6">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-indigo-950/60 pb-4">
          <div class="flex items-center gap-2.5">
            <div class="h-2 w-2 rounded-full bg-emerald-500" />
            <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              IAM Security &amp; Audit Log
            </h3>
          </div>
          <span class="text-[11px] font-mono text-emerald-500">Live</span>
        </div>

        <div class="mt-4 space-y-3.5">
          <div
            v-for="item in dashboardStore.activity"
            :key="item.id"
            class="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 p-3.5 transition-colors"
          >
            <div class="flex items-start justify-between gap-2">
              <p class="text-xs font-semibold text-slate-900 dark:text-white">{{ item.title }}</p>
              <span class="font-mono text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                <Clock class="h-3 w-3 text-indigo-400" /> {{ formatDateTime(item.timestamp) }}
              </span>
            </div>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.subtitle }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
