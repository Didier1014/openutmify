<script>
  import { onMount } from 'svelte';
  import { RefreshCw, Filter, Search, Download, BarChart3 } from 'lucide-svelte';

  let results = [];
  let loading = true;
  let groupBy = 'utm_campaign';

  onMount(async () => {
    try {
      const res = await fetch('/api/utms/report?groupBy=utm_campaign');
      if (res.ok) {
        const data = await res.json();
        results = data.resultados || [];
      }
    } catch (e) {
      console.error(e);
      results = [
        { utm_campaign: 'MOZ MONEY 5.0', vendas: 0, cpa: 0, gastos: 0, faturamento: 0, lucro: 0 },
        { utm_campaign: 'Pree MOZ MONEY 3.2', vendas: 0, cpa: 0, gastos: 0, faturamento: 0, lucro: 0 },
      ];
    }
    loading = false;
  });
</script>

<div class="space-y-6">
  <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div>
      <h2 class="text-xl font-bold text-white">Relatório de UTMs</h2>
      <p class="text-sm text-utmify-400">Análise avançada de KPIs de campanha por parâmetros UTM</p>
    </div>
    <div class="flex items-center gap-2">
      <button class="btn-outline flex items-center gap-2">
        <Download class="w-4 h-4" /> Exportar
      </button>
      <button class="btn-primary flex items-center gap-2">
        <RefreshCw class="w-4 h-4" /> Atualizar
      </button>
    </div>
  </div>

  <div class="glass-panel overflow-hidden">
    <div class="p-4 border-b border-white/10 flex flex-wrap items-center gap-3">
      <label class="text-xs text-utmify-400">Contém Texto</label>
      <input type="text" placeholder="Buscar UTM..." class="bg-utmify-800 border border-white/10 text-white px-3 py-2 rounded-lg text-sm w-48 focus:ring-2 ring-utmify-600 outline-none" />
      <label class="text-xs text-utmify-400">Período de Visualização</label>
      <select class="bg-utmify-800 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:ring-2 ring-utmify-600 outline-none">
        <option>Hoje</option>
        <option>Últimos 7 dias</option>
      </select>
      <label class="text-xs text-utmify-400">Agrupar por</label>
      <select class="bg-utmify-800 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:ring-2 ring-utmify-600 outline-none" bind:value={groupBy}>
        <option value="utm_campaign">utm_campaign</option>
        <option value="utm_source">utm_source</option>
        <option value="utm_medium">utm_medium</option>
        <option value="produto">Produto</option>
        <option value="conta">Conta de Anúncio</option>
      </select>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-white/10">
            {#each ['utm_campaign', 'Vendas', 'CPA', 'Gastos', 'Faturamento', 'Lucro', 'ROAS', 'Margem'] as col}
              <th class="table-header py-3 px-4 cursor-pointer hover:text-white">{col}</th>
            {/each}
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          {#each results as r}
            <tr class="hover:bg-white/5 transition-colors">
              <td class="py-4 px-4 font-medium text-white">{r.utm_campaign || 'Não definido'}</td>
              <td class="py-4 px-4 text-white font-mono">{r.vendas}</td>
              <td class="py-4 px-4 text-utmify-400 font-mono">$ {r.cpa.toFixed(2)}</td>
              <td class="py-4 px-4 text-utmify-400 font-mono">$ {r.gastos.toFixed(2)}</td>
              <td class="py-4 px-4 text-white font-mono">$ {r.faturamento.toFixed(2)}</td>
              <td class="py-4 px-4 text-white font-mono">$ {r.lucro.toFixed(2)}</td>
              <td class="py-4 px-4 text-utmify-400 font-mono">N/A</td>
              <td class="py-4 px-4 text-utmify-400 font-mono">N/A</td>
            </tr>
          {/each}
          {#if results.length === 0}
            <tr>
              <td colspan="8" class="py-8 text-center text-utmify-500">Nenhum resultado encontrado</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    {#each ['ROI', 'Add To Cart', 'CPI', 'CPC', 'CTR', 'CPM', 'Impressões', 'Cliques'] as label, i}
      <div class="glass-panel p-4">
        <div class="flex justify-between items-start mb-2">
          <span class="text-xs text-utmify-400">{label}</span>
          <button class="text-utmify-600 hover:text-white"><BarChart3 class="w-4 h-4" /></button>
        </div>
        <div class="text-2xl font-bold text-white">{i % 2 === 0 ? 'N/A' : '0'}</div>
      </div>
    {/each}
  </div>
</div>
