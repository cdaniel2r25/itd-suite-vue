<template>
  <div>
    <v-tabs v-model="tab">
      <v-tabs-slider />

      <v-tab v-for="item in tabsHeaders" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in tabsContent" :key="item">
        <component
          :is="item"
          :selected-headers="value"
          :campaign-name="campaignName"
        />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import CodeTemplate from '@/components/modules/mailing/campaign/CodeTemplate.vue'
import SavedTemplates from '@/components/modules/mailing/campaign/SavedTemplates.vue'
import PaidTemplates from '@/components/modules/mailing/campaign/PaidTemplates.vue'
import DesignTemplates from '@/components/modules/mailing/campaign/DesignTemplates.vue'

export default {
  name: 'DesignTabs',
  components: { CodeTemplate, SavedTemplates, PaidTemplates, DesignTemplates },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tab: null,
      campaignName: 'Nombre Campaña Test',
      tabsHeaders: [
        'DISEÑO',
        'MIS PLANTILLAS GUARDADAS',
        'CODIFICA TU PLANTILLA',
        'PLANTILLAS PAGADAS',
      ],
      tabsContent: [
        'design-templates',
        'saved-templates',
        'code-template',
        'paid-templates',
      ],
    }
  },
}
</script>
