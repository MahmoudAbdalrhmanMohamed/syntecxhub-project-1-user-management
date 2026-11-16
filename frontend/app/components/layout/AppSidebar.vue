<script setup lang="ts">
import {
  ShieldCheck,
  Users,
  Settings,
  FileCode2,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  Lock,
  Radio,
  Fingerprint,
  Activity,
  X,
  UserCheck,
} from 'lucide-vue-next';

const route = useRoute();
const uiStore = useUiStore();
const colorMode = useColorMode();
const usersStore = useUsersStore();

const navigationGroups = [
  {
    groupTitle: 'IDENTITY ENCLAVE',
    items: [
      { label: 'Security Overview', to: '/', icon: Activity, tag: 'LIVE' },
      { label: 'Workforce Directory', to: '/users', icon: Users, count: computed(() => usersStore.totalUsers || 7) },
    ],
  },
  {
    groupTitle: 'ACCESS GOVERNANCE',
    items: [
      { label: 'Role & Security Matrix', to: '/settings', icon: Settings, tag: 'RBAC' },
      { label: 'API & Key Vault', to: '/api-docs', icon: FileCode2, tag: 'v1.0' },
    ],
  },
];

const isActive = (target: string) => {
  if (target === '/') return route.path === '/';
  return route.path.startsWith(target);
};

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
</script>

<template>
  <div
    v-if="uiStore.mobileSidebarOpen"
    class="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
    @click="uiStore.closeMobileSidebar"
  />

  <aside
    class="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-indigo-950/60 bg-[#080D1A] transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:shrink-0"
    :class="[
      uiStore.sidebarCollapsed ? 'w-20' : 'w-64',
      uiStore.mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <!-- SOC Terminal Brand Header -->
    <div
      class="flex h-16 items-center border-b border-indigo-950/70 bg-[#060A14] transition-all duration-200"
      :class="uiStore.sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'"
    >
      <NuxtLink
        v-if="!uiStore.sidebarCollapsed"
        to="/"
        class="flex items-center min-w-0 gap-3"
      >
        <BrandProjectLogo :size="'md'" />
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="truncate text-sm font-bold tracking-tight text-white block">
              Aegis
            </span>
            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              ZERO-TRUST
            </span>
          </div>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p class="truncate text-[10px] font-mono text-emerald-400 font-medium">
              IAM ENCLAVE // ACTIVE
            </p>
          </div>
        </div>
      </NuxtLink>

      <!-- Collapsed State Header: Logo Emblem with Quick Rail Expand Toggle -->
      <button
        v-else
        type="button"
        class="group/rail flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-950/80 bg-[#0A0F1D] hover:border-indigo-500 hover:bg-indigo-950/70 transition-all cursor-pointer shadow-sm relative"
        title="Expand Sidebar (Ctrl+B)"
        aria-label="Expand Sidebar"
        @click="uiStore.toggleSidebar"
      >
        <BrandProjectLogo :size="'sm'" class="transition-opacity duration-150 group-hover/rail:opacity-0" />
        <PanelLeftOpen class="absolute h-5 w-5 text-indigo-400 opacity-0 group-hover/rail:opacity-100 transition-opacity duration-150" />
      </button>

      <!-- Desktop Collapse Button (Expanded State) -->
      <button
        v-if="!uiStore.sidebarCollapsed"
        type="button"
        class="hidden lg:inline-flex rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-indigo-950/60 transition-all cursor-pointer"
        title="Collapse Sidebar (Ctrl+B)"
        aria-label="Collapse Sidebar"
        @click="uiStore.toggleSidebar"
      >
        <PanelLeftClose class="h-4 w-4" />
      </button>

      <!-- Mobile Close Button -->
      <button type="button" class="lg:hidden rounded-lg p-1.5 text-slate-400" @click="uiStore.closeMobileSidebar">
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- Security Posture Badge Strip (Expanded) -->
    <div
      v-if="!uiStore.sidebarCollapsed"
      class="border-b border-indigo-950/50 bg-indigo-950/20 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-indigo-300/80"
    >
      <span class="flex items-center gap-1.5">
        <Fingerprint class="h-3 w-3 text-indigo-400" />
        <span>TLS 1.3 // SOC2</span>
      </span>
      <span class="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
        100% HEALTHY
      </span>
    </div>

    <!-- Navigation List -->
    <nav class="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      <div v-for="group in navigationGroups" :key="group.groupTitle" class="space-y-1">
        <div
          v-if="!uiStore.sidebarCollapsed"
          class="flex items-center justify-between px-3 pb-1.5"
        >
          <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300/60">
            {{ group.groupTitle }}
          </span>
        </div>

        <NuxtLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          :title="uiStore.sidebarCollapsed ? item.label : undefined"
          class="group relative flex items-center rounded-xl text-xs sm:text-sm font-medium transition-all duration-150"
          :class="[
            uiStore.sidebarCollapsed ? 'justify-center w-12 h-10 mx-auto px-0' : 'gap-3 px-3 py-2.5',
            isActive(item.to)
              ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/25 border border-indigo-400/30'
              : 'text-slate-300 hover:bg-indigo-950/40 hover:text-white',
          ]"
        >
          <component
            :is="item.icon"
            class="h-4 w-4 shrink-0 transition-colors"
            :class="isActive(item.to) ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-300'"
          />
          <span v-if="!uiStore.sidebarCollapsed" class="truncate flex-1">{{ item.label }}</span>
          
          <!-- Count badge -->
          <span
            v-if="!uiStore.sidebarCollapsed && item.count"
            class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
            :class="isActive(item.to) ? 'bg-indigo-800 text-white' : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/40'"
          >
            {{ item.count.value }}
          </span>

          <!-- Tag badge -->
          <span
            v-else-if="!uiStore.sidebarCollapsed && item.tag"
            class="text-[9px] font-mono px-1.5 py-0.5 rounded"
            :class="isActive(item.to) ? 'bg-indigo-800 text-white' : 'bg-indigo-950/40 text-indigo-400'"
          >
            {{ item.tag }}
          </span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Bottom Operator Session Dock -->
    <div class="border-t border-indigo-950/60 p-3 space-y-2.5 bg-[#050810]">
      <!-- Operator Session Card -->
      <div v-if="!uiStore.sidebarCollapsed" class="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40 space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 min-w-0">
            <div class="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              MA
            </div>
            <div class="min-w-0">
              <p class="text-xs font-semibold text-white truncate">M. Abdalrahman</p>
              <p class="text-[10px] text-indigo-400/80 font-mono">SuperAdmin</p>
            </div>
          </div>
          <span class="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            MFA
          </span>
        </div>
        <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-indigo-950/80">
          <span>Session: 54m left</span>
          <span class="text-emerald-400 flex items-center gap-1">
            <Radio class="h-2.5 w-2.5" /> SECURE
          </span>
        </div>
      </div>

      <!-- Rail Expand / Collapse Toggle -->
      <button
        type="button"
        class="flex items-center rounded-xl border border-indigo-950/80 bg-[#0A0F1D] font-medium text-slate-300 hover:border-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer"
        :class="
          uiStore.sidebarCollapsed
            ? 'w-12 h-10 mx-auto justify-center px-0'
            : 'w-full justify-between px-3 py-2 text-xs'
        "
        :title="uiStore.sidebarCollapsed ? 'Expand Sidebar (Ctrl+B)' : 'Collapse Sidebar (Ctrl+B)'"
        aria-label="Toggle Sidebar Rail"
        @click="uiStore.toggleSidebar"
      >
        <span class="flex items-center gap-2">
          <PanelLeftOpen v-if="uiStore.sidebarCollapsed" class="h-4 w-4 text-indigo-400 shrink-0" />
          <PanelLeftClose v-else class="h-4 w-4 shrink-0 text-slate-400" />
          <span v-if="!uiStore.sidebarCollapsed">Collapse Rail</span>
        </span>
        <kbd v-if="!uiStore.sidebarCollapsed" class="hidden sm:inline font-mono text-[10px] text-slate-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-900/60">Ctrl+B</kbd>
      </button>

      <button
        type="button"
        class="flex items-center rounded-xl border border-indigo-950/80 bg-[#0A0F1D] font-medium text-slate-300 hover:border-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer"
        :class="
          uiStore.sidebarCollapsed
            ? 'w-12 h-10 mx-auto justify-center px-0'
            : 'w-full justify-between px-3 py-2 text-xs'
        "
        :title="colorMode.value === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        @click="toggleTheme"
      >
        <span class="flex items-center gap-2">
          <Sun v-if="colorMode.value === 'dark'" class="h-4 w-4 text-amber-400 shrink-0" />
          <Moon v-else class="h-4 w-4 text-indigo-400 shrink-0" />
          <span v-if="!uiStore.sidebarCollapsed">{{ colorMode.value === 'dark' ? 'Light Mode' : 'Dark Mode' }}</span>
        </span>
      </button>
    </div>
  </aside>
</template>