<script>
  import { onMount } from 'svelte';
  import { Logo, Mail, Lock, Eye, EyeOff } from 'lucide-svelte';

  let email = '';
  let password = '';
  let showPassword = false;
  let loading = false;
  let error = '';
  let success = '';

  async function handleLogin(e) {
    e.preventDefault();
    loading = true;
    error = '';
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('utmify_token', data.token);
        localStorage.setItem('utmify_user', JSON.stringify(data.user));
        success = 'Login realizado com sucesso! Redirecionando...';
        setTimeout(() => {
          window.location.href = '/dashboard/resumo';
        }, 800);
      } else {
        error = data.error || 'Erro ao fazer login';
      }
    } catch {
      error = 'Erro de conexão com o servidor';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    const token = localStorage.getItem('utmify_token');
    if (token) {
      window.location.href = '/dashboard/resumo';
    }
  });
</script>

<div class="flex h-screen items-center justify-center bg-utmify-900">
  <div class="absolute top-6 left-6">
    <Logo class="w-8 h-8 text-white" />
  </div>

  <div class="w-full max-w-md p-8">
    <div class="text-center mb-8">
      <Logo class="w-10 h-10 mx-auto mb-4 text-white" />
      <h1 class="text-2xl font-bold text-white">Welcome back!</h1>
      <p class="text-utmify-400 text-sm">Enter your email and password to get started.</p>
    </div>

    <form onsubmit={handleLogin} class="space-y-4">
      {#if error}
        <div class="p-3 rounded bg-danger/10 border border-danger/20 text-danger text-sm">
          {error}
        </div>
      {/if}
      {#if success}
        <div class="p-3 rounded bg-success/10 border border-success/20 text-success text-sm">
          {success}
        </div>
      {/if}

      <div>
        <label class="block text-xs text-utmify-400 mb-1">Email</label>
        <input
          type="email"
          bind:value={email}
          placeholder="seu@email.com"
          class="w-full bg-utmify-800 border border-white/10 text-white px-4 py-3 rounded-lg focus:ring-2 ring-utmify-600 focus:border-utmify-600 outline-none transition-colors"
        />
      </div>

      <div class="relative">
        <label class="block text-xs text-utmify-400 mb-1">Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          bind:value={password}
          placeholder="••••••••"
          class="w-full bg-utmify-800 border border-white/10 text-white px-4 py-3 rounded-lg focus:ring-2 ring-utmify-600 focus:border-utmify-600 outline-none transition-colors pr-10"
        />
        <button
          type="button"
          class="absolute right-3 top-3 text-utmify-500 hover:text-white"
          onclick={() => (showPassword = !showPassword)}
        >
          {#if showPassword}<EyeOff class="w-4 h-4" />{:else}<Eye class="w-4 h-4" />{/if}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>

    <div class="mt-6 text-center space-y-2">
      <p class="text-xs text-utmify-400">
        Don't have an account?
        <a href="#" class="text-utmify-400 hover:text-white underline underline-offset-2">Register now</a>
      </p>
      <p class="text-xs text-utmify-400">
        Forgot your password?
        <a href="#" class="text-utmify-400 hover:text-white underline underline-offset-2">Click here</a>
      </p>
    </div>
  </div>
</div>
