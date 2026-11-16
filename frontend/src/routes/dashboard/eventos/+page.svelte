<script>
  import { onMount } from 'svelte';
  import { RefreshCw, Filter, Search, Eye, Search as SearchIcon } from 'lucide-svelte';

  let events = [];
  let loading = true;
  let filters = {
    period: 'Hoje',
    pixel: 'Todos',
    events: 'Qualquer',
    platform: 'Todas',
  };

  onMount(async () => {
    try {
      const res = await fetch('/api/events/');
      if (res.ok) {
        const data = await res.json();
        events = data.events || [];
      }
    } catch (e) {
      console.error(e);
      events = [
        { id: '1', eventName: 'ViewContent', platform: 'META', pixelId: 'ED_MOZ', status: 'SENT', hasAdClick: true, createdAt: new Date().toISOString(), data: { page: 'Moz Money — Ganha dinheiro extra' } },
        { id: '2', eventName: 'PageView', platform: 'META', pixelId: 'ED_MOZ', status: 'SENT', hasAdClick: true, createdAt: new Date(Date.now() - 60000).toISOString(), data: { page: 'Saldo aprovado — Moz Money' } },
        { id: '3', eventName: 'ViewContent', platform: 'META', pixelId: 'ED_MOZ', status: 'SENT', hasAdClick: true, createdAt: new Date(Date.now() - 120000).toISOString(), data: { page: 'Quiz — Moz Money' } },
      ];
    }
    loading = false;
  });

  const eventTypes = ['PageView', 'ViewContent', 'Lead', 'AddToCart', 'InitiateCheckout', 'Purchase'];
</script>

<div class="space-y-6">
  <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div>
      <h2 class="text-xl font-bold text-white">Eventos</h2>
      <p class="text-sm text-utmify-400">Visualize os eventos enviados pelos pixels</p>
    </div>
    <div class="flex items-center gap-2">
      <button class="btn-primary flex items-center gap-2">
        <RefreshCw class="w-4 h-4" /> Atualizar
      </button>
    </div>
  </div>

  <div class="glass-panel overflow-hidden">
    <div class="p-4 border-b border-white/10 flex flex-wrap items-center gap-3">
      <label class="text-xs text-utmify-400">Período de Visualização</label>
      <select class="bg-utmify-800 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:ring-2 ring-utmify-600 outline-none" bind:value={filters.period}>
        <option>Hoje</option>
        <option>Últimos 7 dias</option>
        <option>Últimos 30 dias</option>
      </select>
      <label class="text-xs text-utmify-400">Pixel</label>
      <select class="bg-utmify-800 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:ring-2 ring-utmify-600 outline-none" bind:value={filters.pixel}>
        <option>Todos</option>
      </select>
      <label class="text-xs text-utmify-400">Eventos</label>
      <select class="bg-utmify-800 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:ring-2 ring-utmify-600 outline-none" bind:value={filters.events}>
        <option>Qualquer</option>
        {#each eventTypes as et}
          <option value={et}>{et}</option>
        {/each}
      </select>
      <label class="text-xs text-utmify-400">Plataforma</label>
      <select class="bg-utmify-800 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:ring-2 ring-utmify-600 outline-none" bind:value={filters.platform}>
        <option>Todas</option>
        <option>Meta</option>
        <option>Google</option>
        <option>TikTok</option>
        <option>Taboola</option>
        <option>Kwai</option>
      </select>
    </div>

    <div class="p-4 border-b border-white/10">
      <div class="flex flex-wrap gap-6 text-xs text-utmify-400">
        <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-utmify-600"></span> Funil do período</div>
        <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-white/20"></span> Dados desde 08/09/2026</div>
      </div>
      <div class="mt-2 flex gap-4">
        {#each ['InitiateCheckout', 'Recebidos', 'Não salvos', 'Salvos', 'Não enviados', 'Enviados'] as label}
          <div class="text-center">
            <div class="text-xs text-utmify-500">{label}</div>
            <div class="text-sm font-mono text-white">0</div>
          </div>
        {/each}
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-white/10">
            {#each ['Data/Hora', 'Status', 'Plataforma', 'Evento', 'Pixel IDs (plataforma)', 'Página', ''] as col}
              <th class="table-header py-3 px-4">{col}</th>
            {/each}
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          {#each events as e}
            <tr class="hover:bg-white/5 transition-colors">
              <td class="py-4 px-4 text-utmify-400 text-xs">{new Date(e.createdAt).toLocaleString('pt-BR')}</td>
              <td class="py-4 px-4">
                <span class="inline-flex items-center gap-1 px-2 py-1 rounded bg-success/10 text-success text-xs">
                  <span class="w-1.5 h-1.5 rounded-full bg-success"></span> {e.status}
                </span>
              </td>
              <td class="py-4 px-4 text-utmify-400">{e.platform}</td>
              <td class="py-4 px-4 font-medium text-white">{e.eventName}</td>
              <td class="py-4 px-4 text-utmify-400 text-xs">{e.pixelId}</td>
              <td class="py-4 px-4 text-utmify-400 text-xs">{e.data?.page || '-'}</td>
              <td class="py-4 px-4">
                <button class="text-utmify-600 hover:text-white"><Eye class="w-4 h-4" /></button>
              </td>
            </tr>
          {/each}
          {#if events.length === 0}
            <tr>
              <td colspan="7" class="py-8 text-center text-utmify-500">Nenhum evento encontrado</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>

  <div class="p-4 border-t border-white/10 text-xs text-utmify-500">
    Conta só o que o script no site enviou. Purchase e Initiate Checkout via S2S aparecem na tabela, não no funil.
  </div>
</div>
