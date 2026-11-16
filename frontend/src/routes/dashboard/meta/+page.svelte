<script>
  import { onMount } from 'svelte';
  import { RefreshCw, Filter, Search, ToggleLeft, ToggleRight, MoreHorizontal, BarChart3 } from 'lucide-svelte';

  let campaigns = [];
  let loading = true;
  let filters = {
    search: '',
    status: 'Qualquer',
    account: 'Qualquer',
    product: 'Qualquer',
  };
  let activeTab = 'Contas';

  onMount(async () => {
    try {
      const res = await fetch('/api/campaigns/');
      if (res.ok) {
        const data = await res.json();
        campaigns = data.campaigns || [];
      }
    } catch (e) {
      console.error(e);
      campaigns = [
        { id: '1', name: 'MOZ MONEY 5.0', status: 'ACTIVE', budget: '$52,00', platform: 'META', conversations: 0, costPerConversation: 'N/A', sales: 0, cpa: 'N/A', spend: '$52,00', adAccount: { platform: 'META', accountName: 'Moz Money - Meta Ads', isConnected: true } },
        { id: '2', name: 'Pree MOZ MONEY 3.2', status: 'ACTIVE', budget: '$32,00', platform: 'META', conversations: 0, costPerConversation: 'N/A', sales: 0, cpa: 'N/A', spend: '$32,00', adAccount: { platform: 'META', accountName: 'Moz Money - Meta Ads', isConnected: true } },
      ];
    }
    loading = false;
  });

  async function toggleStatus(campaign) {
    const newStatus = campaign.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        campaign.status = newStatus;
      }
    } catch (e) {
      console.error(e);
    }
  }

  const tabs = [
    { name: 'Contas', href: '/dashboard/meta' },
    { name: 'Campanhas', href: '/dashboard/meta' },
    { name: 'Conjuntos', href: '/dashboard/meta/sets' },
    { name: 'Anúncios', href: '/dashboard/meta/ads' },
  ];

  const metricButtons = ['FATURAMENTO', 'LUCRO', 'ROAS', 'MARGEM', 'ROI', 'IC', 'CPI', 'CPC', 'CTR', 'CPM', 'IMPRESSÕES', 'CLIQUES'];
</script>

<div class="space-y-6">
  <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div>
      <h2 class="text-xl font-bold text-white">Campanhas</h2>
      <p class="text-sm text-utmify-400">Gerencie suas campanhas de anúncios da Meta</p>
    </div>
    <div class="flex items-center gap-2">
      <input type="text" placeholder="Filtrar por nome" class="bg-utmify-800 border border-white/10 text-white px-3 py-2 rounded-lg text-sm w-48 focus:ring-2 ring-utmify-600 outline-none" bind:value={filters.search} />
      <button class="btn-primary" onclick={() => {}}>Todas as vendas trackeadas</button>
      <button class="btn-primary flex items-center gap-2" onclick={() => {}}>
        <RefreshCw class="w-4 h-4" /> Atualizar
      </button>
    </div>
  </div>

  <div class="flex gap-2 overflow-x-auto pb-2">
    {#each tabs as tab}
      <button class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${activeTab === tab.name ? 'bg-utmify-600 border-utmify-600 text-white' : 'border-white/10 text-utmify-400 hover:text-white'}`}>
        {tab.name}
      </button>
    {/each}
  </div>

  <div class="glass-panel overflow-hidden">
    <div class="p-4 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <label class="text-xs text-utmify-400">Nome da Campanha</label>
        <select class="bg-utmify-800 border border-white/10 text-white px-3 py-1.5 rounded text-xs focus:ring-2 ring-utmify-600 outline-none">
          <option>Qualquer</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-xs text-utmify-400">Status da Campanha</label>
        <select class="bg-utmify-800 border border-white/10 text-white px-3 py-1.5 rounded text-xs focus:ring-2 ring-utmify-600 outline-none" bind:value={filters.status}>
          <option>Qualquer</option>
          <option>ACTIVE</option>
          <option>PAUSED</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-xs text-utmify-400">Período de Visualização</label>
        <select class="bg-utmify-800 border border-white/10 text-white px-3 py-1.5 rounded text-xs focus:ring-2 ring-utmify-600 outline-none">
          <option>Hoje</option>
          <option>Últimos 7 dias</option>
          <option>Últimos 30 dias</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-xs text-utmify-400">Conta de Anúncio</label>
        <select class="bg-utmify-800 border border-white/10 text-white px-3 py-1.5 rounded text-xs focus:ring-2 ring-utmify-600 outline-none">
          <option>Qualquer</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-xs text-utmify-400">Produto</label>
        <select class="bg-utmify-800 border border-white/10 text-white px-3 py-1.5 rounded text-xs focus:ring-2 ring-utmify-600 outline-none">
          <option>Qualquer</option>
        </select>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-white/10">
            <th class="table-header py-3 px-4"><input type="checkbox" class="w-4 h-4 rounded border-white/30" /></th>
            <th class="table-header py-3 px-4">STATUS</th>
            <th class="table-header py-3 px-4">CAMPANHA</th>
            <th class="table-header py-3 px-4">ORÇAMENTO</th>
            <th class="table-header py-3 px-4">CONVERSAS</th>
            <th class="table-header py-3 px-4">CUSTO / CONVERSA</th>
            <th class="table-header py-3 px-4">VENDAS</th>
            <th class="table-header py-3 px-4">CPA</th>
            <th class="table-header py-3 px-4">GASTOS</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          {#each campaigns as c}
            <tr class="hover:bg-white/5 transition-colors group">
              <td class="py-4 px-4"><input type="checkbox" class="w-4 h-4 rounded border-white/30" /></td>
              <td class="py-4 px-4">
                <div class="toggle-switch">
                  <input type="checkbox" checked={c.status === 'ACTIVE'} onchange={() => toggleStatus(c)} />
                  <div class="toggle-slider"></div>
                </div>
              </td>
              <td class="py-4 px-4 font-medium text-white">{c.name}</td>
              <td class="py-4 px-4 text-utmify-400">{c.budget}</td>
              <td class="py-4 px-4 text-utmify-400">{c.conversations}</td>
              <td class="py-4 px-4 text-utmify-400">{c.costPerConversation}</td>
              <td class="py-4 px-4 text-white font-mono">{c.sales}</td>
              <td class="py-4 px-4 text-utmify-400 font-mono">{c.cpa}</td>
              <td class="py-4 px-4 text-utmify-400">{c.spend}</td>
            </tr>
          {/each}
          {#if campaigns.length === 0}
            <tr>
              <td colspan="9" class="py-8 text-center text-utmify-500">Nenhuma campanha encontrada</td>
            </tr>
          {/if}
          <tr class="border-t border-white/10">
            <td colspan="2" class="py-4 px-4 text-utmify-400">N/A</td>
            <td class="py-4 px-4 font-medium text-white">2 CAMPANHAS</td>
            <td class="py-4 px-4 text-white font-mono">$84,00</td>
            <td class="py-4 px-4 text-white font-mono">0</td>
            <td class="py-4 px-4 text-utmify-400">N/A</td>
            <td class="py-4 px-4 text-white font-mono">0</td>
            <td class="py-4 px-4 text-utmify-400">N/A</td>
            <td class="py-4 px-4 text-utmify-400">N/A</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="glass-panel h-64">
      <h3 class="text-sm font-semibold text-white mb-4">Visão geral de métricas</h3>
      <div class="flex items-center justify-end gap-2">
        {#each metricButtons as m}
          <button class="px-2 py-1 rounded text-xs font-medium border border-white/5 hover:bg-white/5 text-utmify-400 hover:text-white transition-colors">
            {m}
          </button>
        {/each}
      </div>
    </div>
  </div>
</div>
