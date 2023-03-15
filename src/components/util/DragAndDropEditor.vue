<template>
  <div>
    <email-editor ref="emailEditor" style="height: 100%" locale="es" />
  </div>
</template>

<script>
import { EmailEditor } from 'vue-email-editor'

export default {
  components: {
    EmailEditor,
  },
  methods: {
    getHtml() {
      this.$refs.emailEditor.editor.exportHtml((data) => {
        this.$emit('get-html', data.html)
      })
    },
  },
}
</script>
