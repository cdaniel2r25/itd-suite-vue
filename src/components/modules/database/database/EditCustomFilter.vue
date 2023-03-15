<template>
  <div>
    <v-row v-if="!hideBackButton" no-gutters>
      <v-col cols="12">
        <v-btn
          text
          color="primary"
          class="px-0"
          @click="$emit('btn-cancel-action')"
        >
          <v-icon color="primary"> mdi-arrow-left </v-icon>
          VOLVER A FILTROS PERSONALIZADOS
        </v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-4">
      <v-col
        :class="{ 'd-flex justify-center': hideBackButton }"
        :cols="hideBackButton ? 12 : 5"
      >
        <h1>
          {{
            !customFiltersItemEdit.id ? 'Crear filtro personalizado' : editTitle
          }}
        </h1>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col :class="{ 'd-flex justify-center': hideBackButton }" cols="12">
        <P class="my-2">
          {{
            customFiltersItemEdit.id
              ? 'Ingresa los datos para editar las condiciones de tu filtro.'
              : editSubTitle
          }}
        </P>
      </v-col>
    </v-row>
    <v-form ref="form" v-model="valid" class="mt-15">
      <v-row
        no-gutters
        :class="{ 'd-flex justify-start mt-4 mb-n10': hideBackButton }"
      >
        <v-col sm="12" md="6" :lg="hideBackButton ? 6 : 4">
          <v-text-field
            v-model="customFiltersItemEdit.name"
            label="Nombre"
            placeholder="Escriba nombre del filtro"
            :rules="nameRules"
            outlined
          />
        </v-col>
      </v-row>
      <v-row :class="{ 'd-flex justify-center mt-4': hideBackButton }">
        <v-col
          cols="12"
          :md="hideBackButton ? 12 : 8"
          :lg="hideBackButton ? 12 : 6"
        >
          <div class="d-flex justify-end">
            <v-btn color="primary" text @click="addAnotherFilter()">
              <v-icon color="primary" class="mr-2">
                mdi-plus-circle-outline
              </v-icon>
              AGREGAR OTRO FILTRO
            </v-btn>
          </div>
          <v-card
            v-for="item in customFiltersItemEditTMP.criterialList"
            :key="item.id"
            outlined
            class="mt-2"
          >
            <div class="icon-delete">
              <v-icon color="primary" class="mr-2" @click="deleteRecods(item)">
                mdi-delete
              </v-icon>
            </div>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4" class="mt-4">
                  <v-select
                    v-model="item.field"
                    :items="headersSearch"
                    :item-text="headersSearch.text"
                    :item-value="headersSearch.value"
                    :rules="fieldRules"
                    label="Columna"
                    placeholder="Seleccionar columna"
                    outlined
                  />
                </v-col>
                <v-col cols="12" md="4" class="mt-4">
                  <v-select
                    v-model="item.condition"
                    :items="itemConditions"
                    :item-text="itemConditions.text"
                    :item-value="itemConditions.value"
                    :rules="conditionRules"
                    label="Condición"
                    placeholder="Seleccionar Condición"
                    outlined
                  />
                </v-col>
                <v-col cols="12" md="4" class="mt-4">
                  <v-text-field
                    v-model="item.value"
                    label="Valor"
                    placeholder="Coloque valor"
                    :rules="valueRules"
                    outlined
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <div
            :class="
              hideBackButton
                ? 'd-flex justify-center mt-10'
                : 'justify-left mt-6'
            "
          >
            <v-btn
              large
              outlined
              color="primary"
              @click="$emit('btn-cancel-action')"
            >
              CANCELAR
            </v-btn>
            <v-btn
              :disabled="!valid"
              large
              color="primary"
              class="ml-5"
              @click="registerAction()"
            >
              {{ labelButton }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'

export default {
  name: 'EditCustomFilter',
  mixins: [validationMixin],
  props: {
    customFiltersItemEdit: {
      type: Object,
      default: () => ({}),
    },
    editTitle: {
      type: String,
      default: 'Editar filtro personalizado',
    },
    editSubTitle: {
      type: String,
      default: 'Ingresa los datos para crear nuevo filtro.',
    },
    labelButton: {
      type: String,
      default: 'GUARDAR',
    },
    headersSearch: {
      type: Array,
      default: () => [],
    },
    hideBackButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      valid: false,
      filtersArrayAux: [],
      itemConditions: [
        {
          text: 'Es igual a',
          value: 'Es igual a',
        },
        {
          text: 'Contiene',
          value: 'Contiene',
        },
        {
          text: 'Empieza con',
          value: 'Empieza con',
        },
        {
          text: 'Termina con',
          value: 'Termina con',
        },
      ],
      customFiltersItemEditTMP: {},
    }
  },
  computed: {
    nameRules() {
      return [(v) => this.isRequired(v, ''), (v) => this.minLength(v, 5)]
    },
    fieldRules() {
      return [(v) => this.isRequired(v, 'Campo')]
    },
    conditionRules() {
      return [(v) => this.isRequired(v, 'Condición')]
    },
    valueRules() {
      return [(v) => this.isRequired(v, '')]
    },
  },
  watch: {
    'customFiltersItemEdit.criterialList': {
      handler(value) {
        if (!this.hideBackButton) {
          this.customFiltersItemEditTMP.criterialList = value
          this.customFiltersItemEditTMP.totalCriterial =
            this.customFiltersItemEdit.totalCriterial
        }
      },
    },
    'customFiltersItemEdit.name': {
      handler(value) {
        this.customFiltersItemEditTMP.name = value
      },
    },
  },
  mounted() {
    this.customFiltersItemEditTMP = structuredClone(this.customFiltersItemEdit)
  },
  methods: {
    deleteRecods(item) {
      if (this.customFiltersItemEditTMP.criterialList.length > 1) {
        const index = this.customFiltersItemEditTMP.criterialList.indexOf(item)
        this.customFiltersItemEditTMP.criterialList.splice(index, 1)
        this.customFiltersItemEditTMP.totalCriterial -= 1
      } else {
        this.customFiltersItemEditTMP.criterialList = [
          { id: null, field: null, condition: null, value: null },
        ]
      }
    },
    addAnotherFilter() {
      if (!this.hideBackButton) {
        this.$emit('add-another-filter')
      } else {
        const idAddRecords =
          this.customFiltersItemEditTMP.criterialList[
            this.customFiltersItemEditTMP.criterialList.length - 1
          ].id + 1
        const itemTMP = {
          id: idAddRecords,
          field: '',
          condition: '',
          value: '',
        }
        this.customFiltersItemEditTMP.criterialList.push(itemTMP)
        this.customFiltersItemEditTMP.totalCriterial =
          this.customFiltersItemEditTMP.criterialList.length
      }
    },
    registerAction() {
      this.$emit('btn-register-action', this.customFiltersItemEditTMP)
    },
  },
}
</script>

<style scoped>
.icon-delete {
  position: absolute;
  right: -6px;
  top: 2px;
}
</style>
