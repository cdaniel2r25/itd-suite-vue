<template>
  <div>
    <v-dialog
      v-model="show"
      width="700"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card flat class="position">
        <v-btn
          color="grey"
          plain
          class="btn-cancel"
          @click="$emit('change-model', false)"
        >
          <v-icon color="grey">mdi-close</v-icon>
        </v-btn>
        <v-card-title class="d-flex justify-center text-h4 accent--text">
          Enviar prueba
        </v-card-title>
        <v-card-title class="mt-10 d-flex justify-center accent--text">
          Ingresa emails para enviar prueba(s).
        </v-card-title>
        <v-card-text class="px-16">
          <div class="d-flex flex-wrap" style="width: 100%">
            <v-chip
              v-for="(chip, i) in emailList"
              :key="i"
              class="ma-2"
              close
              @click:close="removeChip(i)"
            >
              {{ chip }}
            </v-chip>
          </div>
          <v-text-field
            v-model="email"
            label="Ingresar email(s)"
            type="text"
            :rules="emailRules"
            @change="addEmail()"
          />
          <div class="gray300--text caption">Máximo 10 emails.</div>
        </v-card-text>
        <v-card-actions class="justify-center pb-6">
          <v-btn outlined color="primary" @click="$emit('change-model', false)">
            cancelar
          </v-btn>
          <v-btn color="primary" class="ml-2" @click="send()"> enviar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'

export default {
  name: 'SendTestDialog',
  mixins: [validationMixin],
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      email: '',
      emailList: [],
    }
  },
  computed: {
    emailRules() {
      return [(v) => this.isRequired(v, 'Email'), (v) => this.isValidEmail(v)]
    },
  },
  methods: {
    send() {
      console.log('enviar')
    },
    removeChip(i) {
      this.emailList.splice(i, 1)
    },
    addEmail() {
      // this.isValidEmail(this.email)
      if (
        this.email !== '' &&
        this.emailList.length < 11 &&
        this.isValidEmail(this.email) === true
      ) {
        this.emailList.push(this.email)
        this.email = ''
      }
    },
  },
}
</script>
<style scoped>
.btn-cancel {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1rem;
}
.position {
  position: relative;
}
</style>
