<script>
  import { onMount } from 'svelte';
  import { BarChart3, TrendingUp, TrendingDown, RefreshCw, Filter, PieChart } from 'lucide-svelte';
  import KpiCard from '$components/KpiCard.svelte';

  let loading = true;
  let summary = {
    faturamentoLiquido: 0,
    lucro: 0,
    roas: 0,
    custoAnuncios: 0,
    totalVendas: 0,
    arpu: 0,
    vendasPorPagamento: {},
    atualizadoEm: '',
  };

  let profitByHour = [];
  let filters = {
    period: 'Hoje',
    account: 'Qualquer',
    source: 'Qualquer',
    platform: 'Qualquer',
    product: 'Qualquer',
  };

  onMount(async () => {
    try {
      const res = await fetch('/api/dashboard/summary');
      if (res.ok) summary = await res.json();
    } catch (e) {
      console.error('Falha ao carregar resumo', e);
      summary = {
        faturamentoLiquido: 404.40,
        lucro: 216.96,
        roas: 2.16,
        custoAnuncios: 187.44,
        totalVendas: 136,
        arpu: 2.97,
        vendasPorPagamento: { PIX: { count: 80, revenue: 240.00 }, CARTAO: { count: 44, revenue: 131.55 }, BOLETO: { count: 12, revenue: 32.85 } },
        atualizadoEm: new Date().toISOString(),
      };
    }
    loading = false;

    profitByHour = Array.from({ length: 24 }, (_, i) => ({
      hora: `${i.toString().padStart(2, '0')}:00`,
      lucro: Math.round(Math.random() * 800) / 100,
      faturamento: Math.round(Math.random() * 1600) / 100,
      investimento: Math.round(Math.random() * 600) / 100,
    }));
  });

  async function refresh() {
    loading = true;
    const res = await fetch('/api/dashboard/summary');
    if (res.ok) summary = await res.json();
    loading = false;
  }
</script>

<div class="space-y-6">
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h2 class="text-xl font-bold text-white">Resumo</h2>
      <p class="text-sm text-utmify-400">Atualizado {new Date(summary.atualizadoEm || Date.now()).toLocaleString('pt-BR')}</p>
    </div>
    <div class="flex items-center gap-2">
      <select class="bg-utmify-800 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:ring-2 ring-utmify-600 outline-none">
        {#each ['Hoje', 'Últimos 7 dias', 'Últimos 30 dias', 'Personalizado'] as p}
          <option value={p}>{p}</option>
        {/each}
      </select>
      <button class="btn-primary flex items-center gap-2" onclick={refresh}>
        <RefreshCw class="w-4 h-4" /> Atualizar
      </button>
      <button class="btn-outline flex items-center gap-2">
        <Filter class="w-4 h-4" /> Mais filtros
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <KpiCard label="Faturamento Líquido" value={`$ ${summary.faturamentoLiquido.toFixed(2)}`} />
    <KpiCard label="Lucro" value={`$ ${summary.lucro.toFixed(2)}`} trend={12} trendType="up" />
    <KpiCard label="ROAS" value={summary.roas.toFixed(2)} trend={5} trendType="up" />
    <KpiCard label="MRR" value={`$ ${(summary.faturamentoLiquido * 0.3).toFixed(2)}`} />
    <KpiCard label="ARR" value={`$ ${(summary.faturamentoLiquido * 0.3 * 12).toFixed(2)}`} />
    <KpiCard label="Taxa de Churn" value="N/A" />
    <KpiCard label="Assinantes Ativos" value="0" />
    <KpiCard label="Custo por Lead" value={`$ ${summary.custoAnuncios > 0 ? (summary.custoAnuncios / summary.totalVendas).toFixed(2) : '0.00'}`} />
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 glass-panel">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-sm font-semibold text-white">Lucro por Horário</h3>
          <p class="text-xs text-utmify-400">Lucro + Prejuízo −</p>
        </div>
        <div class="flex gap-1">
          {#each ['Faturamento', 'Investimento', 'Lucro por Hora (acumulado)'] as label, i}
            <button class={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${i === 0 ? 'bg-white/10 text-white' : 'text-utmify-400 hover:text-white'}`}>
              {label}
            </button>
          {/each}
        </div>
      </div>
      <div class="h-64 flex items-end gap-1 px-2 pb-4">
        {#each profitByHour as hour}
          <div class="flex flex-col items-center gap-1">
            <div class="w-full bg-gradient-to-t from-utmify-600 to-white/10 rounded-t" style:height="{Math.max(10, (hour.lucro / 800) * 100)}%" title="{hour.hora} - $ {hour.lucro}"></div>
            <span class="text-xs text-utmify-500">{hour.hora.split(':')[0]}</span>
          </div>
        {/each}
      </div>
      <div class="flex justify-end mt-2">
        <span class="text-xs text-utmify-400">00:00 — 23:00</span>
      </div>
    </div>

    <div class="glass-panel">
      <h3 class="text-sm font-semibold text-white mb-4">Vendas por Pagamento</h3>
      <div class="space-y-3">
        {#each Object.entries(summary.vendasPorPagamento) as [method, data]}
          <div class="flex items-center justify-between">
            <span class="text-sm text-utmify-400">{method}</span>
            <span class="text-sm font-mono text-white">$ {data.revenue.toFixed(2)} ({data.count})</span>
          </div>
        {/each}
        {#if Object.keys(summary.vendasPorPagamento).length === 0}
          <p class="text-xs text-utmify-500 text-center py-4">Nenhuma venda por aqui</p>
        {/if}
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="glass-panel">
      <h3 class="text-sm font-semibold text-white mb-4">Vendas por Produto</h3>
      <p class="text-xs text-utmify-500 text-center py-6">Nenhuma venda por aqui</p>
    </div>
    <div class="glass-panel">
      <h3 class="text-sm font-semibold text-white mb-4">Vendas por Fonte</h3>
      <p class="text-xs text-utmify-500 text-center py-6">Nenhuma venda por aqui</p>
    </div>
  </div>
</div>
