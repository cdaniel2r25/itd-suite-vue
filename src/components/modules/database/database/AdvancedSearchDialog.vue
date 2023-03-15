<template>
  <v-dialog v-model="show" persistent width="800">
    <v-card>
      <header-dialog
        header-title="Búsqueda avanzada"
        @btn-close-action="$emit('change-model', false)"
      />
      <v-form ref="form" v-model="valid">
        <v-card-text class="body-dialog overflow-y-auto">
          <div class="text-center mb-4">
            Agrega los filtros que deseas aplicar a la base de datos.
          </div>
          <div class="d-flex justify-end">
            <v-btn color="primary" text @click="addAnotherFilter()">
              <v-icon color="primary" class="mr-2">
                mdi-plus-circle-outline
              </v-icon>
              AGREGAR OTRO FILTRO
            </v-btn>
          </div>
          <v-card
            v-for="item in advancedSearchFilter.criterialList"
            :key="item.id"
            outlined
            class="mt-2"
          >
            <div class="icon-delete">
              <v-icon color="primary" class="mr-2" @click="deleteRow(item)">
                mdi-delete
              </v-icon>
            </div>
            <v-card-text>
              <v-row>
                <v-col cols="4" class="mt-4">
                  <v-select
                    v-model="item.field"
                    :items="headers"
                    :item-text="headers.text"
                    :item-value="headers.value"
                    :rules="fieldRules"
                    label="Columna"
                    placeholder="Seleccionar columna"
                    outlined
                  />
                </v-col>
                <v-col cols="4" class="mt-4">
                  <v-select
                    v-model="item.condition"
                    :items="itemCondition"
                    :item-text="itemCondition.text"
                    :item-value="itemCondition.value"
                    :rules="conditionRules"
                    label="Condición"
                    placeholder="Seleccionar Condición"
                    outlined
                  />
                </v-col>
                <v-col cols="4" class="mt-4">
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
        </v-card-text>
        <footer-dialog
          button-label="APLICAR"
          :valid="valid"
          @btn-close-action="$emit('change-model', false)"
          @btn-active-action="$emit('btn-filter-action')"
        />
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'
import HeaderDialog from '@/components/util/HeaderDialog.vue'
import FooterDialog from '@/components/util/FooterDialog.vue'

export default {
  name: 'AdvancedSearchDialog',
  components: { HeaderDialog, FooterDialog },
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
    advancedSearchFilter: {
      type: Object,
      default: () => ({}),
    },
    headers: {
      type: Array,
      default: () => [],
    },
    idAdvancedSearch: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      valid: false,
      itemCondition: [
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
      idAdd: 0,
    }
  },
  computed: {
    valueRules() {
      return [(v) => this.isRequired(v, '')]
    },
    conditionRules() {
      return [(v) => this.isRequired(v, 'Condición')]
    },
    fieldRules() {
      return [(v) => this.isRequired(v, 'Campo')]
    },
  },
  methods: {
    addAnotherFilter() {
      this.idAdd =
        this.advancedSearchFilter.criterialList[
          this.advancedSearchFilter.criterialList.length - 1
        ].id + 1
      const itemTMP = { id: this.idAdd, field: '', condition: '', value: '' }
      this.advancedSearchFilter.criterialList.push(itemTMP)
      this.advancedSearchFilter.totalcriterialList += 1
    },
    deleteRow(item) {
      this.advancedSearchFilter.criterialList =
        this.advancedSearchFilter.criterialList.filter((e) => e.id !== item.id)
    },
  },
}
</script>
<style scoped>
.body-dialog {
  max-height: calc(100vh * 0.7);
}
</style>
