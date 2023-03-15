<template>
  <v-card v-if="templateVal" flat class="pa-2 mb-5" outlined>
    <v-card
      v-for="component in previewComponents"
      :key="component"
      flat
      class="mb-3 pa-2 accent--text"
      color="gray100"
    >
      <v-row dense class="d-flex justify-end">
        <v-col
          class="d-flex justify-end mb-n4 mr-2 text-subtitle-2 gray300--text"
          cols="2"
        >
          {{
            component === 'Head'
              ? 'Head'
              : component === 'Body'
              ? 'Body'
              : 'Foot'
          }}
        </v-col>
      </v-row>
      <div class="d-flex justify-end">
        <v-col v-if="component === 'Head'" cols="12">
          <span
            v-for="(item, index) in transformedHeaderText"
            :key="index"
            class="text-subtitle-1 accent--text"
          >
            <span
              :class="{ 'gainsboro pl-1 pr-1 mx-1 rounded-lg': item.isVar }"
            >
              <v-icon v-if="item.isVar" x-small>mdi-circle</v-icon>
              {{
                item.isVar
                  ? transformVariablesBetweenBrackets(item.text)
                  : item.text
              }}
            </span>
          </span>
        </v-col>
        <v-col v-else-if="component === 'Body'" cols="12">
          <span v-for="(item, bIndex) in transformedBodyText" :key="bIndex">
            <span
              :class="{ 'gainsboro pl-1 pr-1 mx-1 rounded-lg': item.isVar }"
            >
              <v-icon v-if="item.isVar" x-small>mdi-circle</v-icon>
              {{
                item.isVar
                  ? transformVariablesBetweenBrackets(item.text)
                  : item.text
              }}
            </span>
          </span>
        </v-col>
        <v-col v-else cols="12">
          {{ templateVal.footer }}
        </v-col>
      </div>
    </v-card>
  </v-card>
</template>
<script>
import stringsMixin from '@/mixins/util/stringsMixin'

export default {
  name: 'PreviewOfficialTemplateValidation',
  mixins: [stringsMixin],
  props: {
    templateVal: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      previewComponents: ['Head', 'Body', 'Foot'],
    }
  },
  computed: {
    transformedHeaderText() {
      if (this.templateVal.id !== null)
        return this.bodyTextStyled(this.templateVal.header)
      return []
    },
    transformedBodyText() {
      if (this.templateVal.id !== null)
        return this.bodyTextStyled(this.templateVal.body)
      return []
    },
  },
}
</script>
