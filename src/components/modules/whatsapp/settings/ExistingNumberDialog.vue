<template>
  <v-dialog v-model="show" persistent width="800">
    <v-card>
      <v-card-title class="text-h5 lighten-2">
        <v-btn
          color="grey"
          plain
          class="btn-cancel"
          @click="$emit('change-model', false)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <div class="text-h5 lighten-2 text-center mr-4" style="width: 100%">
          Portar numero existente
        </div>
      </v-card-title>
      <v-form v-if="show" ref="form" v-model="valid">
        <v-card-text>
          <div class="px-13 text-center">
            <span>
              Inicia la migración de un número de telefono existente a tu
              cuenta. luego de entregarnos el número y la cuenta whatsapp
              bussines de destino, se le guiará a través del proceso de
              migración.
            </span>
          </div>
          <div class="px-13 py-4 text-center">
            <span>
              Por favor, introduzca el número de teléfono a portar a
              continuación.
            </span>
          </div>
          <v-row no-gutters class="px-16 pt-4 pr-8">
            <v-col cols="11" class="pr-0">
              <v-text-field
                v-model="addNewRow.name"
                :rules="nameRules"
                label="Nombre empresa"
                placeholder="Ingresar nombre de la empresa"
                type="text"
                outlined
              />
            </v-col>
          </v-row>
          <v-row no-gutters class="pl-16 pr-8">
            <v-col cols="11" class="pr-0">
              <v-text-field
                v-model="addNewRow.businessIdAccount"
                :rules="businessIdAccountRules"
                label="Cuenta Bussiness ID"
                placeholder="Ingresar Cuenta Bussiness ID"
                type="text"
                outlined
              />
            </v-col>
            <v-col cols="1" class="px-0">
              <v-tooltip right color="primary">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="pl-2" color="primary" v-bind="attrs" v-on="on">
                    mdi-help-circle-outline
                  </v-icon>
                </template>
                <div>
                  <div class="pb-2 white--text font-weight-bold">
                    Aqui texto de ayuda
                  </div>
                </div>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row no-gutters class="pl-16 pr-8">
            <v-col cols="4" class="pr-0">
              <v-select
                v-model="addNewRow.prefix"
                :items="countries"
                :rules="prefixRules"
                label="Código de área"
                item-text="prefix"
                return-object
                placeholder="Seleccionar código de área"
                outlined
              >
                <template v-slot:item="slotProps">
                  <i :class="['mr-2', 'em', slotProps.item.flag]"></i>
                  {{ slotProps.item.name }} (+{{ slotProps.item.prefix }})
                </template>
              </v-select>
            </v-col>
            <v-col cols="7" class="px-0">
              <v-text-field
                v-model="addNewRow.phone"
                :rules="phoneRules"
                label="Número celular o fijo para activar"
                placeholder="Ingresar Número celular o fijo para activar"
                type="text"
                outlined
                @keypress="onlyNumbers"
              />
            </v-col>
            <v-col cols="1" class="px-0">
              <v-tooltip right color="primary">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="pl-2" color="primary" v-bind="attrs" v-on="on">
                    mdi-help-circle-outline
                  </v-icon>
                </template>
                <div>
                  <div class="pb-2 white--text font-weight-bold">
                    Aqui texto de ayuda
                  </div>
                </div>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex justify-center py-6">
          <v-btn
            :disabled="!valid"
            class="px-6"
            color="primary"
            @click="dialogAddExistingNumber()"
          >
            SOLICITAR
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'

export default {
  name: 'DialogExistingNumber',
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
    addNewRow: {
      type: Object,
      default: () => {},
    },
    countries: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      existingNumber: true,
      valid: false,
    }
  },
  computed: {
    nameRules() {
      return [(v) => this.isRequired(v, ''), (v) => this.minLength(v, 5)]
    },
    phoneRules() {
      return [
        (v) => this.isRequired(v, 'Teléfono'),
        (v) => this.minLength(v, 5),
      ]
    },
    businessIdAccountRules() {
      return [(v) => this.isRequired(v, ''), (v) => this.minLength(v, 5)]
    },
    prefixRules() {
      return [(v) => this.isRequired(v, '')]
    },
  },
  methods: {
    dialogAddExistingNumber() {
      if (this.$refs.form.validate()) {
        this.$emit('btn-add-action')
      }
    },
  },
}
</script>

<style scoped>
.body-dialog {
  max-height: calc(100vh * 0.7);
}
.btn-cancel {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1rem;
}
.box-row {
  border: 1px solid var(--v-gray100-base);
  width: 100%;
  overflow-y: auto;
}
</style>
