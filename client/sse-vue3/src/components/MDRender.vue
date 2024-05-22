<template>
  <main ref="mainRef"></main>
</template>

<script>
export default {
  data() {
    return {
      htmlStr:
        '<p style="color: red; font-size: 16px;">这是一个段落<a href="http://www.baidu.com" target="_blank">打开心标签</a></p><p style="color: red; font-size: 16px;">这是一个段落<a href="http://www.baidu.com" target="_blank">打开心标签</a></p><span>jiang</span><span>siwni</span>',
      tags: []
    }
  },
  mounted() {
    this.parseHTML(this.htmlStr)
    console.log(this.tags)
  },
  watch: {
    tags: {
      handler(tags) {
        console.log(tags)
        if (tags.length === 0) return
        const tag = tags[tags.length - 1]
        console.log('.>>>', tag)
        this.renderTags([tag], this.$refs.mainRef)
      },
      deep: true
    }
  },
  methods: {
    parseHTML(html) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const elements = Array.from(doc.body.children).map(this.parseElement)
      elements.forEach((el, index) => {
        setTimeout(() => {
          this.tags.push(el)
        }, 1000 * index)
      })
    },
    parseElement(element) {
      const tag = {
        tag: element.tagName.toLowerCase(),
        attributes: Array.from(element.attributes).reduce((attrs, attr) => {
          attrs[attr.name] = attr.value
          return attrs
        }, {}),
        children: Array.from(element.childNodes).map(this.parseNode)
      }
      return tag
    },
    parseNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return { tag: 'span', attributes: {}, content: node.textContent, children: null }
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        return this.parseElement(node)
      }
    },
    renderTags(tags, parent) {
      tags.forEach((tag, index) => {
        setTimeout(() => {
          const element = document.createElement(tag.tag)
          for (const [key, value] of Object.entries(tag.attributes)) {
            element.setAttribute(key, value)
          }
          parent.appendChild(element)
          if (tag.content) {
            this.typeWriterEffect(element, tag.content)
          }
          if (tag.children) {
            this.renderTags(tag.children, element)
          }
        }, 200 * index)
      })
    },
    typeWriterEffect(element, text) {
      const textArray = text.split('')
      let index = 0
      const interval = setInterval(() => {
        if (index < textArray.length) {
          element.textContent += textArray[index]
          index++
        } else {
          clearInterval(interval)
        }
      }, 50)
    }
  }
}
</script>
