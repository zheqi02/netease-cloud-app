<script setup lang="ts">
import ContainerAside from './components/ContainerAside.vue'
import StatusBar from './components/StatusBar.vue'
import ContainerFooter from './components/ContainerFooter.vue'
</script>

<template>
  <Suspense>
    <StatusBar />
  </Suspense>
  <div flex w-screen class="h-[calc(100vh-1.75rem-6rem)]">
    <div select-none>
      <ContainerAside />
    </div>
    <main class="w-[calc(100vw-200px)]" overflow-hidden>
      <Suspense>
        <template #default>
          <RouterView />
        </template>
        <template #fallback>
          Loading...
        </template>
      </Suspense>
    </main>
  </div>
  <ContainerFooter />
  <div class="bg" opacity-65 backdrop-blur z--9999 />
</template>

<style lang="scss">
@use './assets/share.css';

.bg {
  position: fixed;
  top: 0;
  left: 0;
  border-radius: 0.25rem;
  width: 100%;
  height: 100%;
  background-image: url('https://tailwindcss.com/_next/static/media/hero@75.4dea7abe609fc522c039fba7662ceea2.jpg');
  z-index: -1;
  background-size: cover;
  background-repeat: no-repeat;
}

body {
  background-color: transparent;
}
</style>
