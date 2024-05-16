<script setup>
import { ref } from 'vue'
const context = ref('')
const eventSource = ref(null)
const getSSE = () => {
  eventSource.value = new EventSource('http://localhost:3000/sse')
  context.value = ''
  eventSource.value.onmessage = (info) => {
    console.log(info, typeof info)
    context.value += JSON.parse(info.data).message
  }
}
const stop = () => {
  eventSource.value.close()
}
</script>
<template>
  <div class="sse">
    <h1>SSE</h1>
    <button @click="getSSE">getSSE</button>
    <button @click="stop">stop</button>
    <main>{{ context }}</main>
  </div>
</template>

<style></style>
