<template>
  <div cols="6">
    <v-menu
      v-model="menu"
      :disabled="disabled"
      :close-on-content-click="false"
      :nudge-width="150"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          text
          :disabled="disabled"
          color="primary"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon class="ml-2"> mdi-plus-circle-outline </v-icon>
          VARIABLE
        </v-btn>
      </template>

      <v-autocomplete
        ref="selectVars"
        v-model="selection"
        class="pt-4"
        dense
        rounded
        flat
        label="Seleccione Variable"
        :items="headers"
        item-text="field"
        @change="handleOnSelectChange"
      />
    </v-menu>
  </div>
</template>

<script>
import mailingBffMixin from '@/mixins/services/mailingBffMixin'

export default {
  name: 'AddVariableButton',
  mixins: [mailingBffMixin],
  props: {
    value: {
      type: String,
      default: () => '',
    },
    disabled: { type: Boolean, default: () => false },
    headers: {
      type: Array,
      default: () => [
        'Nombre',
        'Apellido',
        'Email',
        'Direccion',
        'Telefono',
        'Cliente',
        'Reseller',
      ],
    },
  },
  data() {
    return {
      selection: '',
      menu: false,
    }
  },
  methods: {
    handleOnSelectChange() {
      let newValue = this.value
      if (this.selection) newValue += `@${this.selection}@`
      this.$refs.selectVars.reset()
      this.menu = false
      this.$emit('input', newValue)
    },
  },
}
</script>
