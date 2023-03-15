<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="template.linkTitle"
          :rules="templateTitleRules"
          label="Título"
          outlined
        />
        <v-text-field
          v-model="template.url"
          :rules="templateUrlRules"
          label="Url"
          outlined
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
        <div>
          <file-uploader
            v-model="fileToUploadModel"
            hide-input-after-select-file
            label="CARGAR MINIATURA"
            :preview-max-height="100"
            preview-max-width="100px"
            only-file-types="image/png, image/jpg, image/jpeg"
            bottom-text="Archivos jpg y png"
          />
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>
<script>
import validationMixin from '@/mixins/validation/validationMixin'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import FileUploader from '@/components/util/FileUploader.vue'

export default {
  components: {
    FileUploader,
  },
  mixins: [validationMixin, whatsappBffMixin],
  props: {
    template: {
      type: Object,
      default: () => ({
        title: '',
        url: '',
        urlThumbnail: '',
      }),
    },
  },
  data: () => ({
    valid: true,
    base64: '',
    imageName: '',
    fileToUpload: null,
    fileToUploadModel: null,
  }),
  computed: {
    templateTitleRules() {
      return [(v) => this.isRequired(v, 'Title'), (v) => this.minLength(v, 2)]
    },
    templateUrlRules() {
      return [
        (v) => this.isRequired(v, 'Url'),
        (v) => this.minLength(v, 2),
        (v) => this.isValidHttpsUrl(v),
      ]
    },
    parseImageName() {
      if (this.imageName.length >= 15) {
        return `${this.imageName.substring(0, 12)}...`
      }
      return this.imageName
    },
  },
  watch: {
    fileToUploadModel() {
      if (this.fileToUploadModel != null && this.fileToUploadModel.length > 0) {
        ;[this.fileToUpload] = this.fileToUploadModel
        this.changeInputFile()
      } else {
        this.base64 = ''
        this.template.urlThumbnail = ''
      }
    },
  },
  methods: {
    copy(str) {
      navigator.clipboard.writeText(str)
    },
    changeInputFile() {
      const formatsAllowed = ['image/jpg', 'image/png', 'image/jpeg']
      if (
        this.fileToUpload &&
        formatsAllowed.includes(this.fileToUpload.type)
      ) {
        const reader = new FileReader()
        reader.readAsDataURL(this.fileToUpload)
        reader.onload = (e) => {
          if (reader.result.length < 20000) {
            this.base64 = reader.result
            this.template.urlThumbnail = this.base64
            this.imageName = this.fileToUpload.name
          } else {
            this.resizeImage(reader, this.fileToUpload, e)
          }
        }
      } else {
        this.clearInput()
        this.$store.commit('alert', {
          type: 'error',
          text: 'Favor de subir una imagen',
        })
      }
    },
    resizeImage(reader, imageFile, e) {
      const img = document.createElement('img')
      img.src = e.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const size = 100
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, size, size)
        const dataurl = canvas.toDataURL(imageFile.type)

        this.base64 = dataurl
        this.template.urlThumbnail = this.base64
        this.imageName = imageFile.name
      }
    },
    clearInput() {
      this.base64 = ''
      this.imageName = ''
      this.fileToUpload = null
      this.template.urlThumbnail = ''
    },
    openThumbFile() {
      document.getElementById('thumbFile').click()
    },
  },
}
</script>
