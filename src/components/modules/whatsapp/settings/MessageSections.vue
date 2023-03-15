<template>
  <v-row no-gutters>
    <v-col cols="12">
      <P class="mt-2 mb-0"> Selecciona secciones para tu mensaje </P>
      <v-chip-group
        v-model="value.mediumTextSelection"
        multiple
        active-class=" white--text greencheck"
        class="mb-4"
        @change="$emit('btn-section-change')"
      >
        <v-chip filter>Header</v-chip>
        <v-chip filter>Body</v-chip>
        <v-chip filter>Footer</v-chip>
        <v-chip filter>Botones</v-chip>
      </v-chip-group>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'MessageSections',
  props: {
    value: {
      type: Object,
      default: () => [],
    },
  },
}
</script>
