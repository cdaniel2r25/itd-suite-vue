<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-container>
      <v-row>
        <v-col cols="8">
          <file-uploader
            v-model="fileToUpload"
            hide-input-after-select-file
            label="ADJUNTAR ARCHIVO"
            only-file-types="image/png, image/jpg, image/jpeg"
            bottom-text="Archivos jpg y png"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          AGREGAR VARIABLE
          <v-icon color="primary"> mdi-plus-circle-outline </v-icon>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="7">
          <emoji-textarea v-model="template.text" class="p-1" />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
import validationMixin from '@/mixins/validation/validationMixin'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import EmojiTextarea from '@/components/EmojiTextarea.vue'
import FileUploader from '@/components/util/FileUploader.vue'

export default {
  components: { EmojiTextarea, FileUploader },
  mixins: [validationMixin, whatsappBffMixin],
  props: {
    template: {
      type: Object,
      default: () => ({
        text: '',
        fileId: '',
      }),
    },
  },
  data: () => ({
    valid: true,
    emojiValue: {
      label: 'Mensaje',
      textValue: '',
    },
    image: {
      isLoading: false,
      loaded: false,
    },
    fileToUpload: null,
  }),
  computed: {
    templateMessageRules() {
      return [(v) => this.isRequired(v, 'Mensaje'), (v) => this.minLength(v, 2)]
    },
  },
  watch: {
    fileToUpload(evt) {
      if (evt.length > 0) {
        const [file] = evt
        this.imageUploaded(file)
      }
    },
  },
  methods: {
    copy(str) {
      navigator.clipboard.writeText(str)
    },
    imageUploaded(file) {
      if (this.imageValidation(file)) {
        this.image.isLoading = true
        this.submitImageServer(file)
      } else {
        this.$store.commit('alert', {
          type: 'error',
          text: 'Imagen inválida',
        })
      }
    },
    async submitImageServer(file) {
      this.saveImage = await this.saveFile(file)
      this.image.isLoading = false
      this.image.loaded = true
      this.template.fileId = this.saveImage.fileId
      return this.saveImage
    },
    imageValidation(file) {
      if (file.size > 20000000) {
        console.error('Tamaño de archivo excede los 20mb')
        this.$store.commit('alert', {
          type: 'error',
          text: 'Imagen supera los 20Mb de tamaño',
        })
        return false
      }
      if (!file.type.startsWith('image/')) {
        console.error('Formato incompatible')
        this.$store.commit('alert', {
          type: 'error',
          text: 'Formato incompatible',
        })
        return false
      }
      return true
    },
  },
}
</script>
<style scoped>
.uploadContainer {
  min-height: 100px;
  border-radius: 20px;
}
</style>
<style scoped>
.upload-container {
  min-height: 100px;
  border-radius: 20px;
}
</style>
