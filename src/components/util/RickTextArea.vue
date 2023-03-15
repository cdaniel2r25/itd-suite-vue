<template>
  <div>
    <v-row no-gutters :class="value.addVars ? 'mb-1' : 'mb-3'">
      <v-col>
        <v-btn
          class="mr-1"
          color="accent"
          outlined
          depressed
          small
          @click="styleAction('*')"
        >
          <v-icon>mdi-format-bold</v-icon>
        </v-btn>
        <v-btn
          class="mr-1"
          color="accent"
          outlined
          depressed
          small
          @click="styleAction('_')"
        >
          <v-icon>mdi-format-italic</v-icon>
        </v-btn>
        <v-btn
          color="accent"
          small
          outlined
          depressed
          @click="styleAction('~')"
        >
          <v-icon>mdi-format-strikethrough</v-icon>
        </v-btn>
      </v-col>
      <v-col v-if="value.addVars" class="d-flex justify-end">
        <v-btn color="primary" text @click="$emit('add-var')">
          <v-icon color="primary" class="mr-2">
            mdi-plus-circle-outline
          </v-icon>
          CREAR VARIABLE
        </v-btn>
      </v-col>
    </v-row>
    <v-menu min-width="auto" :close-on-content-click="false" offset-x offset-y>
      <template v-slot:activator="{ on }">
        <v-textarea
          :id="value.id"
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
          @click="textSelected"
          @blur="$emit('action-blur')"
        >
        </v-textarea>
      </template>
      <VEmojiPicker @select="selectEmoji" />
    </v-menu>
  </div>
</template>

<script>
import { VEmojiPicker } from 'v-emoji-picker'

export default {
  name: 'RichTextArea',
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
  data() {
    return {
      selectedTextAux: {
        textSelection: '',
        textBeforeSelection: '',
        textAfterSelection: '',
        startPos: 0,
        endPos: 0,
      },
    }
  },
  methods: {
    selectEmoji(emoji) {
      this.value.textValue += emoji.data
    },
    textSelected() {
      const element = document.getElementById(this.value.id)
      this.selectedTextAux.startPos = element.selectionStart
      this.selectedTextAux.endPos = element.selectionEnd
      this.selectedTextAux.textSelection = element.value.substring(
        this.selectedTextAux.startPos,
        this.selectedTextAux.endPos
      )
      this.selectedTextAux.textBeforeSelection = element.value.substring(
        0,
        this.selectedTextAux.startPos
      )
      this.selectedTextAux.textAfterSelection = element.value.substring(
        this.selectedTextAux.startPos +
          this.selectedTextAux.textSelection.length,
        element.value.length
      )
    },
    styleAction(action) {
      if (
        this.value.textValue[this.selectedTextAux.startPos - 1] &&
        this.value.textValue[this.selectedTextAux.endPos]
      ) {
        if (
          this.value.textValue[this.selectedTextAux.startPos - 1] === action &&
          this.value.textValue[this.selectedTextAux.endPos] === action
        ) {
          this.selectedTextAux.textBeforeSelection =
            this.selectedTextAux.textBeforeSelection.slice(0, -1)
          this.selectedTextAux.textAfterSelection =
            this.selectedTextAux.textAfterSelection.substring(1)
          this.value.textValue = `${this.selectedTextAux.textBeforeSelection}${this.selectedTextAux.textSelection}${this.selectedTextAux.textAfterSelection}`
          this.selectedTextAux.startPos -= 1
          this.selectedTextAux.endPos -= 1
        } else {
          this.value.textValue = `${this.selectedTextAux.textBeforeSelection}${action}${this.selectedTextAux.textSelection}${action}${this.selectedTextAux.textAfterSelection}`
          this.selectedTextAux.startPos += 1
          this.selectedTextAux.endPos += 1
          this.selectedTextAux.textBeforeSelection = `${this.selectedTextAux.textBeforeSelection}${action}`
          this.selectedTextAux.textAfterSelection = `${action}${this.selectedTextAux.textAfterSelection}`
        }
      } else if (
        this.value.textValue[this.selectedTextAux.startPos - 1] === undefined &&
        this.value.textValue[this.selectedTextAux.endPos]
      ) {
        this.selectedTextAux.textBeforeSelection = action
        this.selectedTextAux.textAfterSelection = `${action}${this.selectedTextAux.textAfterSelection}`
        this.value.textValue = `${this.selectedTextAux.textBeforeSelection}${this.selectedTextAux.textSelection}${this.selectedTextAux.textAfterSelection}`
        this.selectedTextAux.startPos += 1
        this.selectedTextAux.endPos += 1
      } else if (
        this.value.textValue[this.selectedTextAux.startPos - 1] &&
        this.value.textValue[this.selectedTextAux.endPos] === undefined
      ) {
        this.selectedTextAux.textBeforeSelection = `${this.selectedTextAux.textBeforeSelection}${action}`
        this.selectedTextAux.textAfterSelection = action
        this.value.textValue = `${this.selectedTextAux.textBeforeSelection}${this.selectedTextAux.textSelection}${this.selectedTextAux.textAfterSelection}`
        this.selectedTextAux.startPos += 1
        this.selectedTextAux.endPos += 1
      } else if (
        this.value.textValue[this.selectedTextAux.startPos - 1] === undefined &&
        this.value.textValue[this.selectedTextAux.endPos] === undefined
      ) {
        this.selectedTextAux.textBeforeSelection = `${action}`
        this.selectedTextAux.textAfterSelection = `${action}`
        this.value.textValue = `${this.selectedTextAux.textBeforeSelection}${this.selectedTextAux.textSelection}${this.selectedTextAux.textAfterSelection}`
        this.selectedTextAux.startPos += 1
        this.selectedTextAux.endPos += 1
      }
    },
  },
}
</script>
