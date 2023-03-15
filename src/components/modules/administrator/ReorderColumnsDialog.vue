<template>
  <v-dialog v-model="show" persistent width="550">
    <v-card>
      <header-dialog
        header-title="Reordenar columnas de la tabla"
        @btn-close-action="cancelDialog()"
      />
      <v-card-subtitle class="mt-4"
        >Para cambiar el orden de las columnas en la tabla solo debe seleccionar
        la flecha.</v-card-subtitle
      >
      <div class="scroll-v">
        <v-list three-line class="py-2 px-6">
          <v-list-item
            v-for="item in itemDatabase"
            :key="item.value"
            color="gray300"
            class="list-item"
          >
            <template>
              <v-list-item-action class="mt-3">
                <v-checkbox v-model="item.check" />
              </v-list-item-action>
              <v-list-item-content class="my-0">
                <v-list-item-title>
                  {{ item.text.length === 0 ? '----' : item.text }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action class="my-0">
                <v-icon class="icon" @click="$emit('move-up', item)">
                  mdi-chevron-up
                </v-icon>
                <v-icon class="icon" @click="$emit('move-down', item)">
                  mdi-chevron-down
                </v-icon>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
      </div>
      <footer-dialog
        button-label="GUARDAR"
        @btn-close-action="cancelDialog()"
        @btn-active-action="editAction()"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import HeaderDialog from '@/components/util/HeaderDialog.vue'
import FooterDialog from '@/components/util/FooterDialog.vue'

export default {
  name: 'ReorderColumnsDialog',
  components: { HeaderDialog, FooterDialog },
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    itemDatabase: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      benched: 0,
    }
  },
  computed: {
    items() {
      return Array.from({ length: this.length }, (k, v) => v + 1)
    },
    length() {
      return 7000
    },
  },
  methods: {
    cancelDialog() {
      this.$emit('primary-btn-cancel')
    },
    editAction() {
      this.$emit('primary-btn-action', this.itemDatabase)
    },
  },
}
</script>

<style scoped>
.list-item {
  min-height: 0;
  background-color: var(--v-gray100-base);
  margin-bottom: 5px;
}
.list-item:hover {
  border: 2px solid var(--v-gray300-base);
}
.icon:hover {
  color: var(--v-primary-base);
  border-radius: 50%;
  background-color: rgba(0, 147, 177, 0.2);
}
.scroll-v {
  height: 300px;
  overflow: hidden;
  overflow-y: auto;
}
</style>
