<script>
  import Sidebar from '$components/Sidebar.svelte';
  import { User, Bell, Settings, Search, Moon, Sun } from 'lucide-svelte';
  import { onMount } from 'svelte';

  let userName = 'Semana Ferdinand';
  let prize = '$ 511,50 / $ 1M';
  let theme = 'dark';

  onMount(() => {
    const saved = localStorage.getItem('utmify-theme');
    if (saved) theme = saved;
    else theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  });

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('utmify-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
</script>

<div class="flex h-screen overflow-hidden">
  <Sidebar />

  <main class="flex-1 flex flex-col overflow-hidden relative bg-utmify-900">
    <header class="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-utmify-900/80 backdrop-blur-md z-10">
      <div class="flex items-center gap-4">
        <h1 class="text-lg font-bold text-white">Dashboard - {userName}</h1>
        <div class="flex items-center gap-2 text-xs text-utmify-400 bg-white/5 px-3 py-1 rounded-full">
          <span class="w-2 h-2 rounded-full bg-success"></span>
          <span>Online</span>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="hidden md:flex items-center gap-4 text-xs text-utmify-400">
          <div class="flex items-center gap-1">
            <Sun class="w-4 h-4" />
            <Moon class="w-4 h-4" />
          </div>
          <button class="text-utmify-400 hover:text-white transition-colors" onclick={toggleTheme}>
            {theme === 'dark' ? 'Claro' : 'Escuro'}
          </button>
        </div>

        <div class="flex items-center gap-2 pl-4 border-l border-white/10">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-white">{userName}</p>
            <p class="text-xs text-utmify-500">Prêmio {prize}</p>
          </div>
          <div class="w-8 h-8 rounded-full bg-utmify-600 flex items-center justify-center text-white font-bold text-xs">SF</div>
        </div>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto p-6">
      <slot />
    </div>
  </main>
</div>
