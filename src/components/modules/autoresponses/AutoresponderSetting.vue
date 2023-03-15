<template>
  <div class="mt-6 mx-2">
    <div class="d-flex mt-4">
      <v-icon color="primary" class="mr-2">{{
        autoresponderItem.autoresponsesType === 'single'
          ? 'mdi-message-text'
          : 'mdi-format-list-bulleted'
      }}</v-icon>
      {{
        autoresponderItem.autoresponsesType === 'single'
          ? 'Simple/Contacto'
          : 'Menú'
      }}
    </div>
    <div class="mt-10 mb-4">Mensaje</div>
    <v-select
      v-model="autoresponderItem.autoresponsesSetting.messageType"
      :items="typeList"
      label="Tipo"
      placeholder="Seleccionar tipo"
      dense
      hide-details
      outlined
      item-text="text"
      item-value="value"
      @change="$emit('change-element')"
    />
    <div class="d-flex justify-end mt-4">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text color="primary" v-bind="attrs" class="px-0" v-on="on">
            <v-icon left>mdi-plus-circle-outline</v-icon>
            variable
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in variableList"
            :key="index"
            @click="enterVariable(item)"
          >
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <v-menu min-width="auto" :close-on-content-click="true">
      <template v-slot:activator="{ on }">
        <v-textarea
          v-model="autoresponderItem.autoresponsesSetting.messageText"
          placeholder="Ingresa mensaje"
          required
          outlined
          prepend-inner-icon="mdi-emoticon"
          hide-details
          :v-on="on"
          @click:prepend-inner="on.click"
          @change="$emit('change-element')"
        >
        </v-textarea>
      </template>
      <VEmojiPicker @select="selectEmoji" />
    </v-menu>
    <div class="mt-6 caption">
      Activa asignación de agente para cuando necesites contactar con un
      Ejecutivo en la autorrespuesta.
    </div>
    <div class="d-flex align-center mt-4">
      <v-switch
        v-model="autoresponderItem.autoresponsesSetting.assignAgent.active"
        label="Asignar agente"
        hide-details
        class="mt-0"
      />
      <tooltip
        :right="true"
        :left="false"
        message="Configura cómo se realizará<br>la asignación de agente."
      />
    </div>
    <div v-if="autoresponderItem.autoresponsesSetting.assignAgent.active">
      <div class="mt-4 caption">Selecciona un tipo de asignación de agente</div>
      <v-radio-group
        v-model="autoresponderItem.autoresponsesSetting.assignAgent.type"
      >
        <v-radio
          v-for="(agentType, index) in agentTypeList"
          :key="index"
          :value="agentType.value"
        >
          <template v-slot:label>
            <div class="d-flex flex-column">
              <div>{{ agentType.label }}</div>
              <div class="caption">{{ agentType.text }}</div>
            </div>
          </template>
        </v-radio>
      </v-radio-group>
      <div
        v-if="
          autoresponderItem.autoresponsesSetting.assignAgent.type === 'group'
        "
        class="pl-6"
      >
        <v-select
          v-model="
            autoresponderItem.autoresponsesSetting.assignAgent.selectGroup
          "
          :items="agentGroupList"
          label="Grupo"
          placeholder="Seleccionar grupo"
          dense
          hide-details
          outlined
          item-text="text"
          item-value="value"
          class="mb-4"
        />
      </div>
      <v-divider></v-divider>
      <div
        v-if="autoresponderItem.autoresponsesSetting.assignAgent.byDatabase"
        class="mt-4"
      >
        <v-alert dense outlined type="info">
          <div class="gray300--text caption">
            Esta asignación solo podrá ser usada en campañas Whatsapp con
            Autorrespuesta.
          </div>
        </v-alert>
      </div>
      <v-checkbox
        v-model="autoresponderItem.autoresponsesSetting.assignAgent.byDatabase"
      >
        <template v-slot:label>
          <div class="d-flex flex-column">
            <div>Por base de datos (opcional)</div>
            <div class="caption">
              Asignación aleatoria de agente (que tenga menos conversaciones).
            </div>
          </div>
        </template>
      </v-checkbox>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { VEmojiPicker } from 'v-emoji-picker'
import customTableBffMixin from '@/mixins/services/autoresponses/autoresponsesBffMixin'
import Tooltip from '@/components/util/Tooltip.vue'

export default {
  name: 'AutoresponderSetting',
  components: { VEmojiPicker, Tooltip },
  mixins: [customTableBffMixin],
  props: {
    autoresponderItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      typeList: [
        { text: 'Texto', value: 'text' },
        { text: 'Imagen', value: 'image' },
        { text: 'Link', value: 'link' },
        { text: 'Documento', value: 'document' },
      ],
      agentTypeList: [
        {
          label: 'Aleatoria',
          value: 'random',
          text: ' Asignación aleatoria de agente (que tenga menos conversaciones).',
        },
        {
          label: 'Manual',
          value: 'manual',
          text: ' Asignación manual de agente realizada por administrador.',
        },
        {
          label: 'Por Grupo de Agentes',
          value: 'group',
          text: ' Asignación por grupo de agentes.',
        },
      ],
      variableList: null,
      agentGroupList: null,
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  mounted() {
    this.getVariableList()
    this.getAgentGroupList()
  },
  methods: {
    selectEmoji(emoji) {
      this.autoresponderItem.autoresponsesSetting.messageText += emoji.data
      this.$emit('change-element')
    },
    async getVariableList() {
      this.variableList = await this.getVariableListByClientId(this.clientId)
    },
    async getAgentGroupList() {
      this.agentGroupList = await this.getAgentGroupListByClientId(
        this.clientId
      )
    },
    enterVariable(item) {
      this.autoresponderItem.autoresponsesSetting.messageText += item
      this.$emit('change-element')
    },
  },
}
</script>
