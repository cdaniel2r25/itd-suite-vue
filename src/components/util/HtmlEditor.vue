<template>
  <div>
    <prism-editor
      v-if="showHtml"
      v-model="localContent"
      line-numbers
      :highlight="highlighter"
    />
    <vue2-tinymce-editor v-else v-model="localContent" :options="options" />
  </div>
</template>
<script>
import { Vue2TinymceEditor } from 'vue2-tinymce-editor'
import { PrismEditor } from 'vue-prism-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-markup'
import 'prismjs/themes/prism-tomorrow.css'
import 'vue-prism-editor/dist/prismeditor.min.css'

export default {
  components: { PrismEditor, Vue2TinymceEditor },
  model: {
    prop: 'content',
    event: 'content-change',
  },
  props: {
    content: {
      type: String,
      default: '<h1>Some initial content</h1>',
    },
    showHtml: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      options: {
        language: 'es',
      },
    }
  },
  computed: {
    localContent: {
      get() {
        return this.content
      },
      set(value) {
        this.$emit('content-change', value)
      },
    },
  },
  methods: {
    highlighter(code) {
      return highlight(code, languages.html)
    },
  },
}
</script>
