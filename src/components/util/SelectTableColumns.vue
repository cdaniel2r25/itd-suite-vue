<template>
  <v-dialog v-model="dialogAux" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn plain color="primary" v-bind="attrs" v-on="on">
        {{ buttonLabel }}
        <v-icon class="ml-2">{{ buttonIcon }}</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title
        class="d-flex justify-center text-center text-h5 accent--text lighten-2 mb-5"
      >
        {{ dialogTitle }}
      </v-card-title>
      <v-card-subtitle class="d-flex justify-center text-center">
        {{ dialogSubtitle }}
      </v-card-subtitle>

      <v-card-text class="d-flex justify-start text-left">
        <v-list v-if="datableHeadersSorted.length > 0" subheader two-line flat>
          <v-list-item-group v-model="sortColumnsList" multiple>
            <v-list-item v-for="header in tabsHeaders" :key="header.value">
              <template v-slot:default="{ active }">
                <v-list-item-action>
                  <v-checkbox :input-value="active" color="primary" />
                </v-list-item-action>

                <v-list-item-content>
                  <v-list-item-title>
                    {{ header.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>

      <v-card-actions
        class="d-flex justify-center text-h5 accent--text lighten-2 py-5"
      >
        <v-spacer />
        <v-btn color="primary" outlined @click="dialogAux = false">
          cancelar
        </v-btn>
        <v-btn color="primary" @click="updateHeaders()"> guardar </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SelectTableColumns',
  props: {
    dialogSortTable: {
      type: Boolean,
      default: false,
    },
    tabsHeaders: {
      type: Array,
      default: () => [],
    },
    buttonIcon: {
      type: String,
      default: 'mdi-pencil',
    },
    buttonLabel: {
      type: String,
      default: 'reordenar tabla',
    },
    dialogTitle: {
      type: String,
      default: 'Reordenar tabla',
    },
    dialogSubtitle: {
      type: String,
      default: 'Seleccione las columnas que desea visualizar.',
    },
  },
  data() {
    return {
      sortColumnsList: [],
      datableHeadersSorted: [],
      dialogAux: false,
    }
  },
  watch: {
    dialogSortTable: {
      handler(value) {
        if (value) this.dialogAux = true
        this.dialogAux = false
      },
    },
  },
  beforeMount() {
    this.listFill()
  },
  methods: {
    listFill() {
      if (this.sortColumnsList.length < 1)
        this.sortColumnsList = Array.from(Array(this.tabsHeaders.length).keys())
      if (this.datableHeadersSorted.length < 1)
        this.datableHeadersSorted = this.tabsHeaders
    },
    updateHeaders() {
      this.listFill()
      this.sortColumnsList.sort((a, b) => a - b)
      this.datableHeadersSorted = this.sortColumnsList.reduce(
        (p, c) => p.concat(this.tabsHeaders.find((f) => f.id === c)),
        []
      )
      this.$emit('input', this.datableHeadersSorted)
      this.dialogAux = false
    },
  },
}
</script>
