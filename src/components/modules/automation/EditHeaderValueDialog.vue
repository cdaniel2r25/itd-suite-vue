<template>
  <v-dialog v-model="show" persistent width="600">
    <v-card>
      <header-dialog
        :header-title="title"
        @btn-close-action="$emit('change-model', false)"
      />
      <v-form ref="form" v-model="valid">
        <v-card-text class="pt-0">
          <div class="text-center">
            Edita ingresando dato valor o agregando variable de columna de BBDD
            de origen.
          </div>
          <div class="px-4 my-6">
            <v-row>
              <v-col cols="6" class="font-weight-bold">Key</v-col>
              <v-col cols="6" class="font-weight-bold">Valor</v-col>
            </v-row>
            <v-divider class="my-1"></v-divider>
            <v-row class="align-center">
              <v-col cols="6">{{ selectItemHearders.key }}</v-col>
              <v-col cols="6">
                <v-menu
                  bottom
                  origin="center center"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      text
                      color="primary"
                      v-bind="attrs"
                      class="pl-0 caption"
                      v-on="on"
                    >
                      AGREGAR VARIABLE
                      <v-icon right color="primary">
                        mdi-plus-circle-outline
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, i) in listDataBase"
                      :key="i"
                      @click="addVariableKey(item.name)"
                    >
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-text-field
                  v-model="selectItemHearders.value"
                  :rules="textRules"
                  outlined
                  dense
                />
              </v-col>
            </v-row>
            <v-divider class="my-1"></v-divider>
          </div>
          <footer-dialog
            button-label="GUARDAR"
            :valid="valid"
            @btn-close-action="$emit('change-model', false)"
            @btn-active-action="$emit('btn-header-action', selectItemHearders)"
          />
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'
import HeaderDialog from '@/components/util/HeaderDialog.vue'
import FooterDialog from '@/components/util/FooterDialog.vue'

export default {
  name: 'EditHeaderValueDialog',
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
    selectItemHearders: {
      type: Object,
      default: () => ({}),
    },
    listDataBase: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      valid: false,
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
    textRules() {
      return [(v) => this.isRequired(v, '')]
    },
  },
  methods: {
    addVariableKey(name) {
      const newItem = `{{${name}}}`
      this.selectItemHearders.value += newItem
    },
  },
}
</script>

HeaderDialog
