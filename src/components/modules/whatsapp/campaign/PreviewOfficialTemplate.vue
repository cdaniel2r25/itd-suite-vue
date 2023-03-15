<template>
  <v-container>
    <div
      v-if="!onlyTemplate"
      :class="!selectionPreview ? 'text-center' : 'mb-8 text-left'"
    >
      <v-row>
        <v-col>
          <span class="text-h5 accent--text">
            {{ template.name }}
          </span>
        </v-col>
      </v-row>
      <v-row class="align-center">
        <v-col :cols="!selectionPreview ? 12 : 2">
          <v-chip :color="contentTypeColor(template.templateType)">
            {{ contentTypeText }}
          </v-chip>
        </v-col>
        <v-col :cols="!selectionPreview ? 12 : 10">
          <span v-if="template.status" class="success--text"> ACTIVADA </span>
          <span v-else class="error--text"> DESACTIVADA </span>
        </v-col>
      </v-row>
    </div>
    <v-card flat class="pa-3 mb-5 overflow-hidden" outlined>
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
        <div v-if="component" class="d-flex justify-end">
          <v-col v-if="component === 'Head'" cols="12">
            <span
              v-for="(item, index) in transformedHeaderText"
              :key="index"
              class="text-subtitle-1 accent--text"
            >
              <span
                :class="{ 'gainsboro pl-1 pr-1 mx-1 rounded-lg': item.isVar }"
              >
                <v-icon v-if="item.isVar" x-small> mdi-circle </v-icon>
                {{ item.text }}
              </span>
            </span>
          </v-col>
          <v-col v-else-if="component === 'Body'" cols="12">
            <span v-for="(item, bIndex) in transformedBodyText" :key="bIndex">
              <span
                :class="{ 'gainsboro pl-1 pr-1 mx-1 rounded-lg': item.isVar }"
              >
                <v-icon v-if="item.isVar" x-small> mdi-circle </v-icon>
                {{ item.text }}
              </span>
            </span>
          </v-col>
          <v-col v-else cols="12">
            {{ template.footer }}
          </v-col>
        </div>
      </v-card>
    </v-card>
  </v-container>
</template>
<script>
import validationMixin from '@/mixins/validation/validationMixin'
import stringsMixin from '@/mixins/util/stringsMixin'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import whatsappUtil from '@/mixins/util/whatsapp'

const CHIP_CONTENT_TEXT = {
  0: 'Texto',
  1: 'Imagen',
  2: 'Link',
  3: 'Documento',
  4: 'Audio',
}

export default {
  mixins: [validationMixin, whatsappBffMixin, whatsappUtil, stringsMixin],
  props: {
    template: {
      type: Object,
      default: () => ({}),
    },
    selectionPreview: {
      type: Boolean,
      default: false,
    },
    onlyTemplate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      previewComponents: ['Head', 'Body', 'Foot'],
    }
  },
  computed: {
    contentTypeText() {
      const contentText = CHIP_CONTENT_TEXT[this.template.templateType]
      if (contentText) return contentText
      return ''
    },
    transformedHeaderText() {
      if (this.template.header.content)
        return this.bodyTextStyled(this.template.header.content)
      return []
    },
    transformedBodyText() {
      if (this.template.body) return this.bodyTextStyled(this.template.body)
      return []
    },
  },
  methods: {
    contentTypeColor(contentTypeId) {
      contentTypeId = parseInt(contentTypeId, 10)
      const contentType = [
        'primary',
        'error',
        'primary',
        'secondary',
        'primary',
      ]
      if (contentTypeId > contentType.length - 1) return 'Desconocido'
      return contentType[contentTypeId]
    },
  },
}
</script>
