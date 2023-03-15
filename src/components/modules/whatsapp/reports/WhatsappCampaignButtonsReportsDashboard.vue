<template>
  <v-container v-if="cardsList.length > 0">
    <v-row class="justify-start">
      <v-col cols="12" class="text-h6"> CONVERSACIONES </v-col>
      <v-col v-for="card in cardsList" :key="card.id" :cols="cols">
        <v-card
          class="d-flex flex-column justify-center px-3"
          color="lightcyan"
        >
          <v-card-title class="accent--text text-subtitle-1">
            Respuestas {{ card.name }}
          </v-card-title>
          <v-card-text class="d-flex flex-column accent--text">
            <div class="text-md-body-1">Total: {{ card.total }}</div>
            <div>
              <v-tooltip right color="accent">
                <template v-slot:activator="{ on, attrs }">
                  <span class="text-h6" v-bind="attrs" v-on="on">
                    {{ card.percent }}%
                  </span>
                </template>
                <div>
                  <div class="pb-2 white--text font-weight-bold">
                    {{ card.percent }}
                  </div>
                </div>
              </v-tooltip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'

export default {
  name: 'WhatsappCampaignButtonsReportsDashboard',
  mixins: [whatsappBffMixin],
  props: {
    cardsList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      cols: 2,
      answerCardlist: [],
    }
  },
  computed: {
    ...mapGetters(['userDefaultClient']),
  },
}
</script>
