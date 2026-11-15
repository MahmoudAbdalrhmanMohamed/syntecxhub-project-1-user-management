<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}>();
</script>

<template>
  <div class="flex items-center" :class="showText ? 'gap-3' : ''">
    <!-- Vector Emblem -->
    <div
      class="relative shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 via-indigo-900/40 to-slate-950 border border-indigo-500/40 shadow-lg shadow-indigo-500/20 overflow-hidden"
      :class="[
        size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10',
      ]"
    >
      <svg
        viewBox="0 0 64 64"
        class="h-full w-full p-1.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="p1Grad" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#A5B4FC" />
            <stop offset="50%" stop-color="#6366F1" />
            <stop offset="100%" stop-color="#312E81" />
          </linearGradient>
          <linearGradient id="p1Core" x1="22" y1="20" x2="42" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="#C7D2FE" />
          </linearGradient>
        </defs>

        <!-- Shield Outline with Gradient -->
        <path
          d="M32 8 L52 16 V32 C52 44.5 43.5 53.5 32 57 C20.5 53.5 12 44.5 12 32 V16 Z"
          fill="url(#p1Grad)"
          fill-opacity="0.3"
          stroke="url(#p1Grad)"
          stroke-width="3"
          stroke-linejoin="round"
        />

        <!-- Identity Head -->
        <circle cx="32" cy="25" r="5.5" fill="url(#p1Core)" />

        <!-- Identity Torso Arc -->
        <path
          d="M22 41 C22 35.5 26.5 33.5 32 33.5 C37.5 33.5 42 35.5 42 41"
          stroke="#FFFFFF"
          stroke-width="2.5"
          stroke-linecap="round"
        />

        <!-- Security Cipher Pin -->
        <circle cx="32" cy="46" r="2" fill="#38BDF8" />
        <line x1="32" y1="41" x2="32" y2="44" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" />
      </svg>
    </div>

    <!-- Optional Brand Typography -->
    <div v-if="showText" class="min-w-0">
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
  </div>
</template>
