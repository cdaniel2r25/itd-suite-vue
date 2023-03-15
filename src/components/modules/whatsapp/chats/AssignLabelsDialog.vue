<template>
  <v-dialog v-model="show" persistent width="500">
    <v-card>
      <v-card-title class="text-h5 lighten-2">
        <v-btn
          color="grey"
          plain
          class="btn-cancel"
          @click="$emit('change-model', false)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <div class="text-h5 lighten-2 text-center mr-4" style="width: 100%">
          Asignar etiqueta
        </div>
      </v-card-title>
      <v-card-text class="px-12">
        <div class="text-center">
          Aquí podrás asignar etiquetas para tus chats.
        </div>
        <div class="mt-6">
          <v-list height="185" class="overflow-y-auto">
            <v-list-item-group v-model="labelGroup">
              <v-list-item v-for="itemLabel in labelsList" :key="itemLabel.id">
                <v-list-item-avatar>
                  <v-icon :color="itemLabel.color">mdi-label</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ itemLabel.name }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-checkbox
                    v-model="itemLabel.checked"
                    hide-details
                    color="primary"
                  />
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-btn
            text
            color="primary"
            class="caption"
            @click="isCreatingLabel = !isCreatingLabel"
          >
            <v-icon>mdi-plus-circle-outline</v-icon>
            <span class="ml-1">nueva etiqueta</span>
          </v-btn>
        </div>
        <div v-if="isCreatingLabel" class="mt-1">
          <v-form v-if="show" ref="form" v-model="valid">
            <v-row no-gutters>
              <v-col cols="10">
                <v-text-field
                  v-model="labelName"
                  outlined
                  type="text"
                  label="Nombre de nueva etiqueta"
                  :rules="nameRules"
                />
              </v-col>
              <v-col cols="2">
                <div class="border-label ml-2">
                  <div class="label-color">
                    <v-icon small color="grey300"> mdi-pencil </v-icon>
                  </div>
                  <v-menu bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon :color="labelColor"> mdi-label </v-icon>
                      </v-btn>
                    </template>
                    <v-color-picker
                      v-model="labelColor"
                      mode="hexa"
                      hide-canvas
                      hide-inputs
                      hide-mode-switch
                      show-swatches
                    />
                  </v-menu>
                </div>
              </v-col>
            </v-row>
            <div class="d-flex mt-n4">
              <v-btn
                color="gray300"
                text
                class="caption pt-0"
                @click="isCreatingLabel = !isCreatingLabel"
              >
                CANCELAR
              </v-btn>
              <v-btn
                text
                class="pt-0 caption"
                color="primary"
                :disabled="!valid"
                @click="createOrUpdateBtn()"
              >
                guardar
              </v-btn>
            </div>
          </v-form>
        </div>
      </v-card-text>
      <v-card-actions class="justify-center py-6">
        <v-btn color="primary" outlined @click="$emit('change-model', false)">
          CANCELAR
        </v-btn>
        <v-btn
          class="ml-4"
          color="primary"
          :disabled="!validBtn"
          @click="saveLabel()"
        >
          GUARDAR
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import validationMixin from '@/mixins/validation/validationMixin'

export default {
  name: 'AssignLabelsDialog',
  mixins: [whatsappBffMixin, validationMixin],
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    chat: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    valid: false,
    validBtn: false,
    labelsList: [],
    selectedLabels: [],
    labelGroup: null,
    isCreatingLabel: false,
    labelName: '',
    labelColor: '#9E9E9E',
  }),
  computed: {
    ...mapGetters(['clientId']),
    labelsRules() {
      return [(v) => this.isRequiredMultiple(v.length, 'etiqueta')]
    },
    nameRules() {
      return [(v) => this.isRequired(v, ''), (v) => this.minLength(v, 3)]
    },
  },
  watch: {
    labelGroup: {
      handler() {
        this.validBtn = false
        this.labelsList.forEach((label) => {
          if (label.checked) {
            this.validBtn = true
          }
        })
      },
    },
  },
  async mounted() {
    this.getLabelsFilterInit()
    this.labelsList.forEach((item) => {
      item.checked = false
    })
  },
  methods: {
    async getLabelsFilterInit() {
      const filter = {
        page: -1,
      }
      const labels = await this.getLabelsFilter(filter)
      this.labelsList = await labels.dataList
    },
    saveLabel() {
      this.$emit('assign-labels-to-chat', this.labelsList)
      this.valid = false
      this.labelsList.forEach((label) => {
        label.checked = false
      })
    },
    async createOrUpdateBtn() {
      const label = {
        id: null,
        name: this.labelName,
        color: this.labelColor,
        description: '',
      }
      const createdOrUpdatedLabel = await this.createOrUpdateLabel(label)
      console.log('llego: ', createdOrUpdatedLabel)
      await this.labelsList.push(createdOrUpdatedLabel)
      this.labelName = ''
      this.labelColor = '#9E9E9E'
      this.isCreatingLabel = false
      this.getLabelsFilterInit()
    },
  },
}
</script>
<style scoped>
.btn-cancel {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1rem;
}
.border-label {
  border: 1px solid var(--v-primary-base);
  border-radius: 5px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: relative;
}
.label-color {
  position: absolute;
  top: -12px;
  left: 10px;
  background-color: white;
}
</style>
