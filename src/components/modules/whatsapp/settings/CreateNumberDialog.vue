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
          {{ addNewRow.id ? 'Editar' : 'Crear numero' }}
        </div>
      </v-card-title>
      <v-card-text>
        <div v-if="addNewRow.id" class="px-13 text-center">
          <span> Puedes usar una linea existente o solicitar una nueva. </span>
        </div>
      </v-card-text>
      <div class="px-13 d-flex justify-center">
        <v-radio-group
          v-model="hasPhoneOption"
          :disabled="radioButtonsRule"
          row
        >
          <v-radio label="No tengo número" value="1" />
          <v-radio label="Si tengo número" value="2" />
        </v-radio-group>
      </div>
      <div>
        <v-form v-if="show" ref="formNumber" v-model="phoneValidation">
          <div class="px-13 text-center">
            <span v-if="hasPhoneOption === '1'">
              Dejanos tus datos para que nuestros agentes gestionen tu numero
              para linea de whatsapp bussines.
            </span>
            <span v-else>
              Dejanos tu numero para que nuestros agentes gestionen tu actual
              numero para linea de whatsapp bussines api.
            </span>
          </div>
          <div class="px-13 mt-6 d-flex align-start">
            <v-text-field
              v-model="addNewRow.name"
              :rules="nameRules"
              label="Nombre cliente empresa"
              placeholder="Ingresar nombre cliente empresa"
              type="text"
              outlined
            />
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
          </div>
          <v-row no-gutters class="pl-13 pr-6">
            <v-col :cols="hasPhoneOption === '1' ? '11' : '4'" class="pr-0">
              <v-select
                v-model="addNewRow.prefix"
                :items="countries"
                :rules="prefixRules"
                label="Código de área"
                :item-text="hasPhoneOption === '1' ? 'name' : 'prefix'"
                item-value="prefix"
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
            <v-col v-if="hasPhoneOption !== '1'" cols="7" class="px-0">
              <v-text-field
                v-model="addNewRow.phone"
                :rules="phoneRules"
                label="Número"
                placeholder="Ingresar número"
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
          <div v-if="hasPhoneOption === '1'" class="px-13 d-flex align-start">
            <v-text-field
              v-model="addNewRow.email"
              :rules="emailRules"
              label="Email"
              placeholder="Seleccionar email"
              type="text"
              outlined
            />
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
          </div>
          <v-card-actions class="d-flex justify-center py-6">
            <v-btn
              v-if="addNewRow.id"
              text
              color="primary"
              @click="$emit('change-model', false)"
            >
              CANCELAR
            </v-btn>
            <v-btn
              :disabled="!phoneValidation"
              class="px-6"
              color="primary"
              @click="AddCreateNumber()"
            >
              {{ addNewRow.id ? 'GUARDAR' : 'SOLICITAR' }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'

export default {
  name: 'DialogCreateNumber',
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
      hasPhoneOption: '2',
      phoneValidation: false,
    }
  },
  computed: {
    radioButtonsRule() {
      if (this.addNewRow.id !== null) return true
      return false
    },
    nameRules() {
      return [(v) => this.isRequired(v, ''), (v) => this.minLength(v, 5)]
    },
    phoneRules() {
      return [
        (v) => this.isRequired(v, 'Teléfono'),
        (v) => this.minLength(v, 5),
      ]
    },
    prefixRules() {
      return [(v) => this.isRequired(v, '')]
    },
    emailRules() {
      return [(v) => this.isRequired(v, 'Email'), (v) => this.isValidEmail(v)]
    },
  },
  methods: {
    AddCreateNumber() {
      if (this.$refs.formNumber.validate()) {
        if (this.hasPhoneOption === '1') {
          this.$emit('btn-add-action-nt')
        } else {
          this.$emit('btn-add-action-yt')
        }
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
.text-No-lowercase {
  text-transform: none;
}
</style>
