<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <div class="d-flex justify-space-between">
        <div>
          <v-btn
            text
            color="primary"
            class="ml-4"
            @click="$router.push({ name: 'Surveys' })"
          >
            <v-icon class="mr-2">mdi-arrow-left</v-icon>
            VOLVER A encuestas
          </v-btn>
          <div class="mt-4 ml-6">
            <h1>Crear encuesta</h1>
            <P class="my-2">Ingresa los datos para crear nueva encuesta.</P>
            <v-text-field
              v-model="newName"
              hide-details
              label="Nombre"
              placeholder="Ingresar nombre"
              outlined
              style="width: 300px"
              class="mt-6"
            />
            <div class="caption gray300--text">
              Este nombre es solo para registro interno.
            </div>
            <div class="gray300--text mt-6">
              Selecciona un tipo de encuesta o crea uno desde cero.
            </div>
          </div>
          <div class="mt-2" style="max-width: 1220px">
            <v-data-iterator
              v-if="surveysList"
              :items="surveysList"
              :loading="loading"
              hide-default-footer
            >
              <template v-slot:default="props">
                <v-row no-gutters>
                  <v-col
                    v-for="item in props.items"
                    :key="item.id"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                    class="mt-4"
                  >
                    <div v-if="item.id === '-1'">
                      <v-hover v-slot="{ hover }">
                        <v-card
                          color="lightcyan"
                          :elevation="hover ? 16 : 2"
                          width="250"
                          height="198"
                          class="mx-auto d-flex justify-center align-center"
                          :class="{ 'on-hover': hover }"
                          @click="selectNew(item)"
                        >
                          <div>
                            <v-card-text class="py-0">
                              <v-icon color="primary">
                                mdi-plus-circle-outline
                              </v-icon>
                            </v-card-text>
                            <v-card-title class="py-0">
                              Crear nueva
                            </v-card-title>
                          </div>
                        </v-card>
                      </v-hover>
                      <div
                        v-if="item !== null"
                        class="mx-auto mt-2"
                        style="width: 250px"
                      >
                        {{ item.name }}
                      </div>
                    </div>
                    <survey-sheet
                      v-if="item.id !== '-1'"
                      :not-menu="notMenu"
                      :item="item"
                      @active-select="activeSelect"
                      @view-template="viewTemplate"
                    />
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>
          </div>
        </div>
      </div>
      <edit-new-surveys-dialog
        v-if="showEdit"
        :key="keyEdit"
        v-model="showEdit"
        :selected-item="selectedItem"
      />
    </v-col>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import surveysBffMixin from '@/mixins/services/surveysBffMixin'
import SurveySheet from '@/components/modules/surveys/SurveySheet.vue'
import EditNewSurveysDialog from '@/components/modules/surveys/EditNewSurveysDialog.vue'

export default {
  name: 'NewSurveysDialog',
  components: { SurveySheet, EditNewSurveysDialog },
  mixins: [surveysBffMixin],
  data() {
    return {
      loading: false,
      newName: '',
      notMenu: true,
      surveysList: null,
      selectedItem: null,
      showEdit: false,
      keyEdit: 0,
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  mounted() {
    this.getSurveys()
  },
  methods: {
    async getSurveys() {
      this.loading = true
      const surveysListTMP = await this.getLastSevenSurveysByClientId(
        this.clientId
      )
      const newElement = {
        id: '-1',
        name: 'En blanco',
        description: '',
        privacyResults: '',
        status: true,
        imageCode64: '',
        creationDate: '',
        answers: 0,
      }
      surveysListTMP.unshift(newElement)
      this.surveysList = surveysListTMP
      this.loading = false
    },
    async activeSelect(item) {
      const params = {
        clientId: this.clientId,
        surveyId: item.surveyId,
      }
      const newItem = await this.getSurveyTemplateByClientIdAndSurveyId(params)
      newItem.surveyId = ''
      newItem.name = `${item.name}(2)`
      newItem.description = ''
      this.selectedItem = newItem
      this.keyEdit += 1
      this.showEdit = true
    },
    viewTemplate(item) {
      console.log('template: ', item)
    },
    async selectNew(item) {
      if (this.newName !== '') {
        item.name = this.newName
      }
      const newItem = {
        surveyId: '',
        name: item.name,
        description: '',
        contents: [],
        configuration: {
          privacySurvey: 'database',
          allowOnlyOneAnswer: false,
          surveyDuration: 'limited',
          thankYouMessage: '',
        },
      }
      this.keyEdit += 1
      this.selectedItem = newItem
      this.showEdit = true
    },
  },
}
</script>
<style scoped>
.v-card.on-hover {
  background-color: rgba(0, 147, 177, 0.5) !important;
}
</style>
