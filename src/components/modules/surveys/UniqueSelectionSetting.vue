<template>
  <div>
    <v-text-field
      v-model="selectedItem.question"
      hide-details
      label="Ingresa tu pregunta"
      @change="$emit('apply-saving')"
    />
    <v-list dense class="mt-4">
      <v-list-item
        v-for="(option, i) in selectedItem.options"
        :key="i"
        class="px-0"
        style="min-height: 35px; height: 35px"
      >
        <v-list-item-avatar
          class="mr-0 pb-2"
          style="width: 23px; min-width: 23px"
        >
          <v-icon
            small
            color="gray300"
            class="pl-0"
            style="justify-content: left"
          >
            mdi-checkbox-blank-circle-outline
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-text-field v-model="option.option" dense />
        </v-list-item-content>
        <v-list-item-action class="ml-0">
          <v-btn
            icon
            color="gray300"
            class="mr-0"
            @click="$emit('delete-item-option', selectedItem, i)"
          >
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <div class="mt-4 d-flex">
      <v-btn
        small
        class="ma-2"
        outlined
        color="primary"
        @click="$emit('add-option')"
      >
        <v-icon left>mdi-plus</v-icon>
        añadir opción
      </v-btn>
      <v-btn
        small
        text
        color="primary"
        class="ma-2"
        @click="$emit('add-another')"
      >
        agregar RESPUESTA 'otro'
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UniqueSelectionSetting',
  props: {
    selectedItem: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
