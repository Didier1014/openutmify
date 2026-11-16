<script>
  import { Logo, Menu, LayoutDashboard, Facebook, Play, Tiktok, ClipboardList, FileText, BarChart3, Settings, Bell, CreditCard, Share2, ArrowUpRight, LogOut } from 'lucide-svelte';

  const sections = [
    { name: 'Resumo', icon: LayoutDashboard, href: '/dashboard/resumo' },
    { name: 'Meta', icon: Facebook, href: '/dashboard/meta' },
    { name: 'Google', icon: Play, href: '/dashboard/google' },
    { name: 'Kwai', icon: Tiktok, href: '/dashboard/kwai' },
    { name: 'TikTok', icon: Tiktok, href: '/dashboard/tiktok' },
    { name: 'Taboola', icon: ClipboardList, href: '/dashboard/taboola' },
    { name: 'UTMs', icon: Share2, href: '/dashboard/utms' },
    { name: 'Integrações', icon: Settings, href: '/dashboard/integrations' },
    { name: 'Regras', icon: BarChart3, href: '/dashboard/rules' },
    { name: 'Taxas', icon: CreditCard, href: '/dashboard/taxes' },
    { name: 'Despesas', icon: FileText, href: '/dashboard/expenses' },
    { name: 'Relatórios', icon: BarChart3, href: '/dashboard/reports' },
    { name: 'Pedidos', icon: ShoppingCart, href: '/dashboard/orders' },
    { name: 'Eventos', icon: Activity, href: '/dashboard/events' },
    { name: 'Notificações', icon: Bell, href: '/dashboard/notifications' },
  ];

  const secondary = [
    { name: 'Assinatura', icon: CreditCard, href: '/dashboard/subscription' },
    { name: 'Minha conta', icon: User, href: '/dashboard/account' },
    { name: 'Avançado', icon: Settings, href: '/dashboard/advanced' },
    { name: 'Indique e Ganhe 10%', icon: Share2, href: '/dashboard/referral' },
    { name: 'Suporte', icon: HelpCircle, href: '/dashboard/support' },
    { name: 'Novidades', icon: Bell, href: '/dashboard/news' },
    { name: 'Aplicativo', icon: ArrowUpRight, href: '/dashboard/app' },
  ];

  let active = '/dashboard/resumo';
</script>

<aside class="fixed left-0 top-0 h-full w-64 bg-utmify-900 border-r border-white/10 z-50">
  <div class="p-5">
    <div class="flex items-center gap-2 mb-8">
      <Logo class="w-7 h-7 text-white" />
      <span class="text-xl font-bold text-white tracking-tight">utmify</span>
    </div>
    <nav class="space-y-1">
      {#each sections as section}
        <a href={section.href} class={active === section.href ? 'sidebar-link active' : 'sidebar-link'}>
          <section.icon class="w-5 h-5" />
          <span class="text-sm">{section.name}</span>
        </a>
      {/each}
    </nav>
  </div>

  <div class="absolute bottom-0 w-full p-5 border-t border-white/10">
    <nav class="space-y-1">
      {#each secondary as item}
        <a href={item.href} class="sidebar-link">
          <item.icon class="w-5 h-5" />
          <span class="text-sm">{item.name}</span>
        </a>
      {/each}
    </nav>
  </div>
</aside>
