<script>
  export let label;
  export let value;
  export let subtext;
  export let trend;
  export let trendType;
</script>

<div class="kpi-card">
  <div class="flex justify-between items-start">
    <div>
      <p class="kpi-label">{label}</p>
      <p class="kpi-value">{value}</p>
      {#if subtext}
        <p class="text-xs text-utmify-400 mt-1">{subtext}</p>
      {/if}
    </div>
    {#if trend !== undefined}
      <div class="flex items-center gap-1">
        <span class={`text-xs font-medium ${trendType === 'up' ? 'text-success' : 'text-danger'}`}>
          {trendType === 'up' ? '▲' : '▼'} {trend}%
        </span>
      </div>
    {/if}
  </div>
</div>
