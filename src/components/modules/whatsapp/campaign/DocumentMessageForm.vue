<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-row>
      <v-col cols="7">
        <file-uploader
          v-model="uploadedFiles.file"
          hide-input-after-select-file
          label="ADJUNTAR DOCUMENTO"
          :preview-max-height="250"
        />
      </v-col>
    </v-row>
  </v-form>
</template>
<script>
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import FileUploader from '@/components/util/FileUploader.vue'

export default {
  components: {
    FileUploader,
  },
  mixins: [whatsappBffMixin],
  props: {
    template: {
      type: Object,
      default: () => ({}),
    },
    uploadedFiles: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    valid: true,
  }),
}
</script>
<style scoped>
.upload-container {
  min-height: 100px;
  border-radius: 20px;
}
</style>
