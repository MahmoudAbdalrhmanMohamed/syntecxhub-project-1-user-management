<script setup lang="ts">
import {
  LayoutDashboard,
  Users,
  Settings,
  FileCode2,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  ShieldCheck,
  X,
  UserCheck,
  Sparkles,
} from 'lucide-vue-next';

const route = useRoute();
const uiStore = useUiStore();
const colorMode = useColorMode();
const usersStore = useUsersStore();

const navigationGroups = [
  {
    groupTitle: 'IDENTITY & DIRECTORY',
    items: [
      { label: 'Executive Overview', to: '/', icon: LayoutDashboard },
      { label: 'User Directory', to: '/users', icon: Users, count: computed(() => usersStore.totalUsers || 7) },
    ],
  },
  {
    groupTitle: 'ACCESS & GOVERNANCE',
    items: [
      { label: 'Security & Roles', to: '/settings', icon: Settings },
      { label: 'OpenAPI Explorer', to: '/api-docs', icon: FileCode2 },
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
    class="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
    @click="uiStore.closeMobileSidebar"
  />

  <aside
    class="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200/90 dark:border-indigo-950/60 bg-white dark:bg-[#0A0E1A] transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:shrink-0"
    :class="[
      uiStore.sidebarCollapsed ? 'w-20' : 'w-64',
      uiStore.mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <!-- Brand Header -->
    <div
      class="flex h-16 items-center border-b border-slate-200/90 dark:border-indigo-950/60 transition-all duration-200"
      :class="uiStore.sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'"
    >
      <NuxtLink
        to="/"
        class="flex items-center min-w-0"
        :class="uiStore.sidebarCollapsed ? 'justify-center' : 'gap-3'"
        :title="uiStore.sidebarCollapsed ? 'Syntecxhub IAM' : undefined"
      >
        <BrandProjectLogo :size="'md'" />
        <div v-if="!uiStore.sidebarCollapsed" class="min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white block">
              Syntecxhub
            </span>
            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              IAM
            </span>
          </div>
          <p class="truncate text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Identity &amp; Governance
          </p>
        </div>
      </NuxtLink>

      <!-- Desktop Collapse Button (Expanded State) -->
      <button
        v-if="!uiStore.sidebarCollapsed"
        type="button"
        class="hidden lg:inline-flex rounded-lg p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-indigo-950/60 transition-all cursor-pointer"
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

    <!-- Grouped Navigation -->
    <nav class="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      <div v-for="group in navigationGroups" :key="group.groupTitle" class="space-y-1">
        <p
          v-if="!uiStore.sidebarCollapsed"
          class="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-indigo-300/50"
        >
          {{ group.groupTitle }}
        </p>

        <NuxtLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          :title="uiStore.sidebarCollapsed ? item.label : undefined"
          class="group relative flex items-center rounded-xl text-sm font-medium transition-all duration-150"
          :class="[
            uiStore.sidebarCollapsed ? 'justify-center w-12 h-10 mx-auto px-0' : 'gap-3 px-3 py-2.5',
            isActive(item.to)
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-300',
          ]"
        >
          <component :is="item.icon" class="h-4 w-4 shrink-0" />
          <span v-if="!uiStore.sidebarCollapsed" class="truncate flex-1">{{ item.label }}</span>
          <span
            v-if="!uiStore.sidebarCollapsed && item.count"
            class="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            :class="isActive(item.to) ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-indigo-950/80 text-slate-600 dark:text-indigo-300'"
          >
            {{ item.count.value }}
          </span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Bottom Status & Theme Dock -->
    <div class="border-t border-slate-200/90 dark:border-indigo-950/60 p-3 space-y-2 bg-slate-50/50 dark:bg-[#070A12]/50">
      <div v-if="!uiStore.sidebarCollapsed" class="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/50 flex items-center gap-2.5">
        <div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <div class="min-w-0 flex-1">
          <p class="text-[11px] font-semibold text-indigo-900 dark:text-indigo-200 truncate">IAM Policy Enforced</p>
          <p class="text-[10px] text-indigo-600 dark:text-indigo-400">Zero-Trust Directory</p>
        </div>
      </div>

      <!-- Rail Expand / Collapse Toggle -->
      <button
        type="button"
        class="flex items-center rounded-xl border border-slate-200 dark:border-indigo-950/80 bg-white dark:bg-[#0E1322] font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-400 transition-colors cursor-pointer"
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
          <span v-if="!uiStore.sidebarCollapsed">Collapse Sidebar</span>
        </span>
        <kbd v-if="!uiStore.sidebarCollapsed" class="hidden sm:inline font-mono text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">Ctrl+B</kbd>
      </button>

      <button
        type="button"
        class="flex items-center rounded-xl border border-slate-200 dark:border-indigo-950/80 bg-white dark:bg-[#0E1322] font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition-colors cursor-pointer"
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
          <Moon v-else class="h-4 w-4 text-indigo-600 shrink-0" />
          <span v-if="!uiStore.sidebarCollapsed">{{ colorMode.value === 'dark' ? 'Light Mode' : 'Dark Mode' }}</span>
        </span>
      </button>
    </div>
  </aside>
</template>
