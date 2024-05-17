<script setup>
import { ref } from 'vue'
import MarkDownIt from 'markdown-it'

import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
const context = ref('')
const eventSource = ref(null)
const markdown = new MarkDownIt({
  html: true,
  vue: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {
        console.log(',,,,', __)
      }
    }
    return ''
  }
})
const getSSE = () => {
  eventSource.value = new EventSource('http://localhost:3000/sse')
  context.value = ''
  eventSource.value.onmessage = (info) => {
    // console.log(info, typeof info)
    context.value += JSON.parse(info.data).message
    const html = markdown.render(JSON.parse(info.data).message)
    messages.value.push(html)
  }
}
const messages = ref([])
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
    <div v-for="(message, index) in messages" :key="index" v-html="message"></div>
  </div>
</template>

<style>
.markdown-output {
  white-space: pre-wrap;
}
</style>
