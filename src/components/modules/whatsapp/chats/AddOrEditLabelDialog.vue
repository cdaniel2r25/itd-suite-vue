<template>
  <v-dialog v-model="show" persistent width="800">
    <v-card>
      <v-form v-if="show" ref="form" v-model="valid">
        <v-card-title class="text-h5 lighten-2">
          <v-btn color="grey" plain class="btn-cancel" @click="closeDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <div class="text-h5 lighten-2 text-center mr-4" style="width: 100%">
            {{ labelToEdit ? 'Editar etiqueta' : 'Crear etiqueta' }}
          </div>
        </v-card-title>
        <v-card-text class="px-12">
          <div class="mt-6 mx-12 px-12">
            <v-row no-gutters>
              <v-col cols="10">
                <v-text-field
                  v-model="labelName"
                  outlined
                  type="text"
                  label="Nombre"
                  placeholder="Ingresar nombre de etiqueta"
                  :rules="nameRules"
                />
              </v-col>
              <v-col cols="2" class="d-flex justify-center pt-3">
                <v-menu bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon :color="labelColor"> mdi-label </v-icon>
                    </v-btn>
                  </template>
                  <v-color-picker
                    v-model="labelColor"
                    mode="hexa"
                    hide-canvas
                    hide-inputs
                    hide-mode-switch
                    show-swatches
                  />
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-textarea
                  v-model="labelDescription"
                  outlined
                  rows="2"
                  label="Descripción"
                  placeholder="Ingresar descripción de etiqueta"
                />
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions class="justify-center py-6">
          <v-btn color="primary" outlined @click="closeDialog()">
            CANCELAR
          </v-btn>
          <v-btn
            class="ml-4 px-6"
            color="primary"
            :disabled="!valid"
            @click="createOrUpdateBtn()"
          >
            {{ labelToEdit ? 'EDITAR' : 'CREAR' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'

export default {
  name: 'AddOrEditLabelDialog',
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
    labelToEdit: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    valid: false,
    labelId: null,
    labelName: '',
    labelColor: '#9E9E9E',
    labelDescription: '',
  }),
  computed: {
    nameRules() {
      return [(v) => this.isRequired(v, ''), (v) => this.minLength(v, 3)]
    },
  },
  mounted() {
    if (this.labelToEdit) {
      this.labelId = this.labelToEdit.id
      this.labelName = this.labelToEdit.name
      this.labelColor = this.labelToEdit.color
      this.labelDescription = this.labelToEdit.description
    }
  },
  methods: {
    closeDialog() {
      this.$emit('clear-data')
      this.labelName = ''
      this.labelColor = '#9E9E9E'
      this.labelDescription = ''
      this.$emit('change-model', false)
    },
    createOrUpdateBtn() {
      this.$emit('create-update-label', {
        id: this.labelId,
        name: this.labelName,
        color: this.labelColor,
        description: this.labelDescription,
      })
      this.labelName = ''
      this.labelColor = '#9E9E9E'
      this.labelDescription = ''
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
</style>
