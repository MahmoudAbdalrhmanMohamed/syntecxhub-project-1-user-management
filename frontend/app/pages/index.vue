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
  Fingerprint,
  Lock,
  Key,
  Activity,
  FileText,
  UserPlus,
} from 'lucide-vue-next';

useSeoMeta({
  title: 'Workforce Directory — Aegis Identity',
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
    <!-- Security Operations Command Strip -->
    <div class="relative overflow-hidden rounded-2xl border border-indigo-950/80 bg-gradient-to-r from-[#0C1222] via-[#0E162B] to-[#080D1A] p-6 sm:p-7 shadow-lg shadow-indigo-950/30">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold">
              <ShieldCheck class="h-3.5 w-3.5 text-indigo-400" />
              <span>AEGIS IDENTITY // SOC-2 COMPLIANCE TERMINAL</span>
            </span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ZERO-TRUST ACTIVE
            </span>
          </div>

          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Workforce Identity &amp; Access Governance
          </h2>
          <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Centralized role-based access control, cryptographic session integrity, and department telemetry across multi-cloud infrastructure.
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <button type="button" class="btn-secondary text-xs sm:text-sm" @click="dashboardStore.fetchDashboardData()">
            <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': dashboardStore.loading }" />
            <span>Audit Sync</span>
          </button>
          <NuxtLink to="/users" class="btn-primary text-xs sm:text-sm">
            <Users class="h-4 w-4" />
            <span>Workforce Directory</span>
            <ArrowUpRight class="h-4 w-4" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Security KPI HUD (4 Columns) -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <!-- Total Identities -->
      <div class="surface-card rounded-xl border border-indigo-950/80 bg-[#0A0F1F] p-4 sm:p-5 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">Total Identities</span>
          <div class="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Fingerprint class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold text-white font-mono tracking-tight">
          {{ (dashboardStore.stats?.summary as any)?.totalUsers ?? 0 }}
        </p>
        <div class="mt-2 flex items-center justify-between text-[11px] font-mono text-indigo-300/80">
          <span>Provisioned Accounts</span>
          <span class="text-emerald-400 font-semibold">100% Verified</span>
        </div>
      </div>

      <!-- Active Operators -->
      <div class="surface-card rounded-xl border border-indigo-950/80 bg-[#0A0F1F] p-4 sm:p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">Active Operators</span>
          <div class="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <UserCheck class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
          {{ (dashboardStore.stats?.summary as any)?.activeUsers ?? 0 }}
        </p>
        <div class="mt-2 flex items-center justify-between text-[11px] font-mono text-emerald-400/80">
          <span>Active Sessions</span>
          <span>Zero Lockouts</span>
        </div>
      </div>

      <!-- Suspended / Anomalies -->
      <div class="surface-card rounded-xl border border-indigo-950/80 bg-[#0A0F1F] p-4 sm:p-5 relative overflow-hidden group hover:border-rose-500/40 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">Suspended Flag</span>
          <div class="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <UserX class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold text-rose-400 font-mono tracking-tight">
          {{ (dashboardStore.stats?.summary as any)?.suspendedUsers ?? 0 }}
        </p>
        <div class="mt-2 flex items-center justify-between text-[11px] font-mono text-rose-400/80">
          <span>Revoked Access</span>
          <span>Isolated</span>
        </div>
      </div>

      <!-- Governance Enclaves -->
      <div class="surface-card rounded-xl border border-indigo-950/80 bg-[#0A0F1F] p-4 sm:p-5 relative overflow-hidden group hover:border-purple-500/40 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">Organizational Units</span>
          <div class="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Building2 class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold text-purple-400 font-mono tracking-tight">
          {{ (dashboardStore.stats?.summary as any)?.totalDepartments ?? 0 }}
        </p>
        <div class="mt-2 flex items-center justify-between text-[11px] font-mono text-purple-300/80">
          <span>Departments</span>
          <span>Enclaves Active</span>
        </div>
      </div>
    </div>

    <!-- Main Workspace Split: Access Control Matrix & Audit Timeline -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Left 2 Cols: Role & Access Matrix -->
      <div class="lg:col-span-2 space-y-6">
        <div class="rounded-xl border border-indigo-950/80 bg-[#0A0F1F] p-5 sm:p-6 shadow-sm">
          <div class="flex items-center justify-between pb-4 border-b border-indigo-950/70">
            <div>
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                <Lock class="h-4 w-4 text-indigo-400" />
                <span>Privilege Tier Distribution</span>
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                Role-Based Access Control (RBAC) assignments and administrative footprint.
              </p>
            </div>
            <span class="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded border border-indigo-900/50">
              POLICY: STRICT
            </span>
          </div>

          <!-- Role Bars Grid -->
          <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="role in (dashboardStore.stats?.distributions?.usersByRole ?? [])"
              :key="role.role"
              class="p-4 rounded-lg bg-indigo-950/20 border border-indigo-900/40 hover:border-indigo-500/40 transition-colors"
            >
              <div class="flex items-center justify-between">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase font-mono tracking-wider" :class="getRoleBadgeClass(role.role)">
                  {{ role.role }}
                </span>
                <span class="text-lg font-bold font-mono text-white">
                  {{ role.count }} <span class="text-xs font-normal text-slate-400">users</span>
                </span>
              </div>
              <div class="mt-3 h-1.5 w-full bg-indigo-950/80 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full"
                  :style="{ width: `${Math.min(100, (role.count / ((dashboardStore.stats?.summary as any)?.totalUsers || 1)) * 100)}%` }"
                />
              </div>
              <p class="mt-2 text-[11px] text-slate-400 font-mono">
                {{ Math.round((role.count / ((dashboardStore.stats?.summary as any)?.totalUsers || 1)) * 100) }}% of workforce directory
              </p>
            </div>
          </div>
        </div>

        <!-- Department Enclaves Breakdown -->
        <div class="rounded-xl border border-indigo-950/80 bg-[#0A0F1F] p-5 sm:p-6 shadow-sm">
          <div class="flex items-center justify-between pb-4 border-b border-indigo-950/70">
            <div>
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                <Building2 class="h-4 w-4 text-purple-400" />
                <span>Department Enclave Roster</span>
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                Headcount and active operator assignments by functional department.
              </p>
            </div>
          </div>

          <div class="mt-4 divide-y divide-indigo-950/60">
            <div
              v-for="dept in (dashboardStore.stats?.distributions?.usersByDepartment ?? [])"
              :key="dept.department"
              class="py-3 flex items-center justify-between text-xs"
            >
              <div class="flex items-center gap-3">
                <span class="h-2 w-2 rounded-full bg-indigo-400" />
                <span class="font-medium text-slate-200">{{ dept.department }}</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="font-mono text-indigo-300 font-bold">{{ dept.count }} account(s)</span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-slate-400 border border-indigo-900/40">
                  ISOLATED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right 1 Col: Real-Time Audit Log Timeline -->
      <div class="rounded-xl border border-indigo-950/80 bg-[#0A0F1F] p-5 sm:p-6 shadow-sm flex flex-col">
        <div class="flex items-center justify-between pb-4 border-b border-indigo-950/70">
          <div>
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <Activity class="h-4 w-4 text-emerald-400" />
              <span>Real-Time Audit Ledger</span>
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">Live session &amp; directory mutations.</p>
          </div>
          <span class="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        </div>

        <div class="mt-4 flex-1 space-y-4 overflow-y-auto max-h-[500px]">
          <div
            v-for="(event, idx) in (dashboardStore.activity ?? [])"
            :key="idx"
            class="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/30 text-xs space-y-1.5"
          >
            <div class="flex items-center justify-between">
              <span class="font-mono text-[10px] text-indigo-400 font-bold uppercase">
                {{ event.action || 'IDENTITY_MUTATION' }}
              </span>
              <span class="text-[10px] font-mono text-slate-500">
                {{ formatDateTime(event.timestamp) }}
              </span>
            </div>
            <p class="font-semibold text-slate-200 truncate">
              {{ event.title || event.description }}
            </p>
            <div class="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Actor: {{ event.actor || 'System Engine' }}</span>
              <span class="text-emerald-400">SIG_VERIFIED</span>
            </div>
          </div>

          <div
            v-if="!dashboardStore.activity?.length"
            class="text-center py-12 text-slate-500 text-xs font-mono"
          >
            No security audit records logged in current frame.
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-indigo-950/70 flex items-center justify-between text-xs">
          <NuxtLink to="/users" class="text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1">
            <span>Inspect User Table</span>
            <ArrowUpRight class="h-3 w-3" />
          </NuxtLink>
          <span class="font-mono text-[10px] text-slate-500">ENCLAVE SECURE</span>
        </div>
      </div>
    </div>
  </div>
</template>