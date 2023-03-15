<template>
  <div>
    <v-row class="my-5">
      <v-col class="accent--text" cols="12">
        Ingresa el nombre de la campaña y selecciona tu remitente
      </v-col>
    </v-row>
    <v-form v-model="validation.valid">
      <v-row class="mt-5">
        <v-col cols="12">
          <v-text-field
            v-model="campaign.name"
            :rules="campaignNameRules"
            label="Nombre Campaña"
            outlined
            style="width: 50%"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-select
            v-model="campaign.sender"
            :items="senders"
            :item-text="(item) => item.name + ' <' + item.phone + '> '"
            item-value="id"
            label="Remitente"
            :rules="senderRules"
            outlined
            required
            return-object
            height="32px"
            class="mb-n5"
            style="width: 50%"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="mt-10 mb-5 accent--text" cols="12">
          Otras opciones en envío
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-checkbox
            v-model="campaign.options.allowDuplicates"
            label="Permitir duplicados"
          />
          <v-tooltip right color="primary">
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="pl-2" color="primary" v-bind="attrs" v-on="on">
                mdi-help-circle-outline
              </v-icon>
            </template>
            <div>
              <div class="pb-2 white--text font-weight-bold">Lorem Ipsum</div>
            </div>
          </v-tooltip>
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-checkbox
            v-model="campaign.options.allowShortLinks"
            label="Utilizar link cortos/ se reemplazan en whatsapp"
          />
          <v-tooltip right color="primary">
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="pl-2" color="primary" v-bind="attrs" v-on="on">
                mdi-help-circle-outline
              </v-icon>
            </template>
            <div>
              <div class="pb-2 white--text font-weight-bold">Lorem Ipsum</div>
            </div>
          </v-tooltip>
        </v-col>
        <v-col class="d-flex flex-column" cols="12">
          <div class="d-flex flex-row">
            <v-checkbox
              v-model="agentColumnCheckbox"
              label="Asignar columna de base de datos para agente."
            />
            <v-tooltip right color="primary">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="pl-2" color="primary" v-bind="attrs" v-on="on">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <div>
                <div class="pb-2 white--text font-weight-bold">Lorem Ipsum</div>
              </div>
            </v-tooltip>
          </div>
          <v-col v-if="agentColumnCheckbox" cols="12">
            <v-select
              v-model="campaign.options.agentColumn"
              :items="campaign.database.headerConfigList"
              item-text="field"
              item-value="field"
              label="Columna"
              placeholder="Seleccionar columna"
              :rules="agentColumnRules"
              style="width: 25%"
              outlined
            />
          </v-col>
        </v-col>
        <v-col class="d-flex flex-column" cols="12">
          <div class="d-flex flex-row">
            <v-checkbox
              v-model="aliasColumnCheckbox"
              label="Asignar columna de base de datos para alias de whatsapp"
            />
            <v-tooltip right color="primary">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="pl-2" color="primary" v-bind="attrs" v-on="on">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <div>
                <div class="pb-2 white--text font-weight-bold">Lorem Ipsum</div>
              </div>
            </v-tooltip>
          </div>
          <v-col v-if="aliasColumnCheckbox" cols="12">
            <v-select
              v-model="campaign.options.aliasColumn"
              :items="campaign.database.headerConfigList"
              item-text="field"
              item-value="field"
              label="Columna"
              placeholder="Seleccionar columna"
              :rules="aliasColumnRules"
              style="width: 25%"
              outlined
            />
          </v-col>
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-checkbox
            v-model="campaign.options.approval"
            label="Aprobador ( selector de usuario ) Opcional"
          />
          <v-tooltip right color="primary">
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="pl-2" color="primary" v-bind="attrs" v-on="on">
                mdi-help-circle-outline
              </v-icon>
            </template>
            <div>
              <div class="pb-2 white--text font-weight-bold">Lorem Ipsum</div>
            </div>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import validationMixin from '@/mixins/validation/validationMixin'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import generalMixin from '@/mixins/util/generalMixin'

export default {
  mixins: [validationMixin, whatsappBffMixin, generalMixin],
  props: {
    campaign: {
      type: Object,
      default: () => ({
        generalData: {
          name: '',
        },
      }),
    },
    validation: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    basePath: '/admin-bff',
    senders: [],
    agentColumnCheckbox: false,
    aliasColumnCheckbox: false,
  }),
  computed: {
    ...mapGetters(['userDefaultClient']),
    campaignNameRules() {
      return [
        (v) => this.isRequired(v, 'Nombre Campaña'),
        (v) => this.minLength(v, 2),
      ]
    },
    senderRules() {
      return [(v) => this.isRequired(v, 'Remitente')]
    },
    agentColumnRules() {
      return [(v) => this.isRequired(v, 'Agente')]
    },
    aliasColumnRules() {
      return [(v) => this.isRequired(v, 'Alias')]
    },
  },
  watch: {
    'campaign.database.id': {
      handler(value) {
        if (value) {
          this.campaign.options.aliasColumn = null
          this.campaign.options.agentColumn = null
        }
      },
    },
  },
  beforeMount() {
    this.getConnectors()
  },
  mounted() {
    if (this.campaign.options.agentColumn !== undefined)
      this.agentColumnCheckbox = true
    if (this.campaign.options.aliasColumn !== undefined)
      this.aliasColumnCheckbox = true
  },
  methods: {
    async getConnectors() {
      const filterService = {
        statusList: [1, 2],
        page: -1,
      }

      const senderObject = await this.getSendersByClient(filterService)
      this.senders = await senderObject.dataList
    },
  },
}
</script>
