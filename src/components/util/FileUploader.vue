<template>
  <div style="width: 100%">
    <div
      v-if="!(hideInputAfterSelectFile && fileArray && fileArray.length > 0)"
    >
      <v-btn text color="primary" @click="openThumbFile()">
        {{ label }}
        <v-icon color="primary" class="ml-2">mdi-paperclip</v-icon>
      </v-btn>
      <div class="text-caption ml-4">{{ bottomText }}</div>
    </div>
    <v-file-input
      id="thumbFile"
      v-model="fileArray"
      truncate-length="50"
      :accept="onlyFileTypes"
      :show-size="showSize"
      class="d-none"
      :multiple="multiple"
      flat
      solo
    />
    <v-list v-if="fileArray && fileArray.length" subheader>
      <v-list-item
        v-for="(file, index) in fileArray"
        :key="index"
        class=".rounded-lg pl-1 pr-1 mb-2"
        dense
      >
        <v-card
          v-if="file"
          rounded="5"
          elevation="3"
          color="gray"
          class="mb-1 mt-1"
          width="100%"
        >
          <v-col
            v-if="
              tempSelectedFile && isImage && tempSelectedFile.name === file.name
            "
            cols="12"
          >
            <v-img
              :max-height="previewMaxHeight"
              :max-width="previewMaxWidth"
              width="100%"
              :src="imgUrlHandler"
              counter
            />
          </v-col>
          <v-col cols="12" class="d-flex">
            <v-list-item-content>
              <v-list-item-title class="accent--text" v-text="file.name" />
              <v-list-item-subtitle v-text="getSingleFileSize(file)" />
            </v-list-item-content>
            <v-btn v-if="file && isImage(file)" icon>
              <v-icon
                :color="
                  file &&
                  tempSelectedFile &&
                  tempSelectedFile.name === file.name
                    ? 'primary'
                    : 'accent'
                "
                @click="previewSelectedImg(file)"
              >
                mdi-eye
              </v-icon>
            </v-btn>
            <v-btn icon @click="deleteItem(file, index)">
              <v-icon color="accent"> mdi-close </v-icon>
            </v-btn>
          </v-col>
        </v-card>
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'inputFiles',
    event: 'inputFiles-change',
  },
  props: {
    inputFiles: {
      type: Array,
      default: () => [File],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    previewMaxHeight: {
      type: Number,
      default: 250,
    },
    previewMaxWidth: {
      type: String,
      default: 'auto',
    },
    hideInputAfterSelectFile: {
      type: Boolean,
      default: false,
    },
    showSize: {
      type: Boolean,
      default: false,
    },
    showSingleFileSize: {
      type: Boolean,
      default: false,
    },
    onlyFileTypes: {
      type: String,
      default: '',
    },
    bottomText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      tempSelectedFile: null,
    }
  },
  computed: {
    imgUrlHandler() {
      if (!this.fileArray) return null
      if (this.fileArray.length >= 1) {
        if (this.tempSelectedFile)
          return URL.createObjectURL(this.tempSelectedFile)
      }
      return null
    },
    fileArray: {
      get() {
        return this.inputFiles
      },
      set(value) {
        if (Array.isArray(value)) {
          this.$emit('inputFiles-change', value)
        } else {
          this.$emit('inputFiles-change', [value])
        }
      },
    },
  },
  watch: {
    fileArray: {
      handler(value) {
        if (!value || value.length === 0) {
          this.tempSelectedFile = null
        }
        if (value.length >= 1) {
          value.forEach((element) => {
            if (this.isImage(element) && this.tempSelectedFile === null) {
              this.tempSelectedFile = element
            }
          })
        }
      },
    },
  },
  methods: {
    deleteItem(files, index) {
      if (this.fileArray.length > 1) {
        if (
          this.tempSelectedFile &&
          this.tempSelectedFile.name === files.name
        ) {
          this.tempSelectedFile = null
        }
        this.fileArray.splice(index, 1)
      } else {
        this.fileArray = []
        this.tempSelectedFile = null
      }
    },
    isImage(files) {
      return files.type.split('/')[0] === 'image'
    },
    reverseString(str) {
      const splitString = str.split('')
      const reverseArray = splitString.reverse()
      const joinArray = reverseArray.join('')
      return joinArray
    },
    getFileType(filename) {
      const filetypeMirror = this.reverseString(filename).split('.')[0]
      return `.${this.reverseString(filetypeMirror)}`
    },
    previewSelectedImg(event) {
      if (this.tempSelectedFile && this.tempSelectedFile.name === event.name) {
        this.tempSelectedFile = null
      } else if (
        !this.multiple &&
        this.tempSelectedFile &&
        this.tempSelectedFile.name === event.name
      ) {
        this.tempSelectedFile = null
      } else {
        this.tempSelectedFile = event
      }
    },
    getSingleFileSize(files) {
      if (this.showSingleFileSize) {
        const result = files.size / 1048576
        return `[${Math.round((result + Number.EPSILON) * 100) / 100} MB]`
      }
      return ''
    },
    openThumbFile() {
      document.getElementById('thumbFile').click()
    },
  },
}
</script>
