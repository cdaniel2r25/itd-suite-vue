<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-row>
      <v-col cols="3"> </v-col>
      <v-col cols="4" class="ml-6">
        AGREGAR VARIABLE
        <v-icon color="primary"> mdi-plus-circle-outline </v-icon>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="7">
        <emoji-textarea v-model="template.text" :rules="textMessageRules" />
      </v-col>
    </v-row>
  </v-form>
</template>
<script>
import validationMixin from '@/mixins/validation/validationMixin'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import EmojiTextarea from '@/components/EmojiTextarea.vue'

export default {
  components: { EmojiTextarea },
  mixins: [validationMixin, whatsappBffMixin],
  props: {
    template: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    valid: true,
  }),
  computed: {
    templateMessageRules() {
      return [(v) => this.isRequired(v, 'Mensaje'), (v) => this.minLength(v, 2)]
    },
    textMessageRules() {
      return [(v) => this.isRequired(v, 'Mensaje'), (v) => this.minLength(v, 2)]
    },
  },
}
</script>
