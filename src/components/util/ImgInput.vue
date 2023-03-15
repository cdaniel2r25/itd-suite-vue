<template>
  <v-col cols="1">
    <v-card relative outlined rounded="lg" min-width="100px" min-height="100px">
      <v-img :src="url" height="100px" @click="addImage()">
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-icon size="400%"> mdi-account </v-icon>
          </v-row>
        </template>
      </v-img>
      <v-btn
        class="v-fab"
        color="grey"
        dark
        absolute
        bottom
        x-small
        fab
        @click="addImage()"
      >
        <v-icon color="black">mdi-camera-plus</v-icon>
      </v-btn>
    </v-card>
    <input
      ref="fileInput"
      class="d-none"
      type="file"
      @change="handleFileChange"
    />
  </v-col>
</template>

<script>
export default {
  name: 'ImgInput',
  props: {
    value: { type: String, default: null },
  },
  data() {
    return {
      url: null,
    }
  },
  methods: {
    handleFileChange(e) {
      // TODO:
      // File type validation
      // File size validation max 2mb
      // send alert on form validation failure
      this.url = URL.createObjectURL(e.target.files[0])
      // The following does base64 image encoding
      const reader = new FileReader()
      const file = e.target.files[0]
      reader.onloadend = () => {
        this.$emit('input', reader.result)
      }
      try {
        reader.readAsDataURL(file)
      } catch (error) {
        console.log(error)
        this.$store.commit('alert', {
          color: 'error',
          text: 'Error al cargar imagen',
        })
      }
      // Whenever the file changes, emit the 'input' event with the file data.
      this.$emit('input', null)
    },
    addImage() {
      this.$refs.fileInput.click()
    },
  },
}
</script>

<style scoped>
.v-fab {
  bottom: -10px;
  right: -10px;
}
</style>
