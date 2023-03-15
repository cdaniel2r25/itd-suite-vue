<template>
  <v-menu min-width="auto" :close-on-content-click="false" offset-x offset-y>
    <template v-slot:activator="{ on }">
      <v-textarea
        v-model="value.textValue"
        :rules="rules"
        :label="value.label"
        :placeholder="value.placeholder"
        required
        outlined
        :rows="value.rows"
        :auto-grow="value.autoGrow"
        prepend-inner-icon="mdi-emoticon"
        :v-on="on"
        @click:prepend-inner="on.click"
      >
      </v-textarea>
    </template>
    <VEmojiPicker @select="selectEmoji" />
  </v-menu>
</template>

<script>
import { VEmojiPicker } from 'v-emoji-picker'

export default {
  components: {
    VEmojiPicker,
  },
  props: {
    value: {
      type: Object,
      default: () => [],
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    selectEmoji(emoji) {
      this.value.textValue += emoji.data
    },
  },
}
</script>
