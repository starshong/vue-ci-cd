<script setup>
import { generateColors } from '@element-plus/colors'
import HelloWorld from './components/HelloWorld.vue'

const { primary, success, warning, danger, error, info } =
  generateColors('#0052d9')

// console.log('primary ', primary)

function handleColors() {
  const themePrimary = primary
    .map((item, index) => `$h-primary-${index}: ${item} !default;`)
    .join('\n')
  console.log(themePrimary)
}
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>

    <button @click="handleColors">按钮</button>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <h1>测试CI/CD</h1>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
