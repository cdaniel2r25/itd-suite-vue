<template>
  <v-dialog v-model="show" persistent width="600px">
    <v-card>
      <v-card-title class="text-h5 lighten-2 mb-4">
        <v-btn color="grey" plain class="btn-cancel" @click="closeDialog()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <div class="text-h5 lighten-2 text-center mr-4" style="width: 100%">
          {{ createContactOnly ? 'Nuevo Contacto' : 'Nueva Conversación' }}
        </div>
      </v-card-title>
      <v-card-text>
        <v-row v-if="!createContactOnly" class="justify-center">
          <v-radio-group v-model="radioGroup" row>
            <v-radio label="Contacto existente" :value="0" />
            <v-radio label="Contacto nuevo" :value="1" />
          </v-radio-group>
        </v-row>
        <v-row v-if="loading">
          <v-skeleton-loader type="article, actions" />
        </v-row>
        <v-row v-else justify="center">
          <v-col cols="8">
            <div
              v-if="radioGroup === 0 && !createContactOnly"
              class="d-flex align-center"
            >
              <v-autocomplete
                v-if="!activeGroup"
                v-model="selectedContactId"
                :items="contactList"
                item-text="name"
                item-value="id"
                outlined
                prepend-inner-icon="mdi-magnify"
                hide-details
                :class="!activeGroup ? 'transition' : ''"
              />
              <v-select
                v-if="activeGroup"
                v-model="selectedType"
                :items="chatLabelList"
                item-text="name"
                return-object
                outlined
                prepend-inner-icon="mdi-magnify"
                hide-details
                :class="activeGroup ? 'transition' : ''"
                @change="changeSelectedType()"
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    close
                    outlined
                    label
                    color="primary"
                    @click="data.select"
                    @click:close="remove()"
                  >
                    <v-avatar left>
                      <v-icon
                        small
                        :color="data.item.color"
                        :src="data.item.icon"
                      >
                        {{ data.item.icon }}
                      </v-icon>
                    </v-avatar>
                    {{ data.item.name }}
                  </v-chip>
                </template>
                <template v-slot:item="data">
                  <v-list-item-content v-if="data.item.header !== ''">
                    {{ data.item.header }}
                  </v-list-item-content>
                  <v-list-item-avatar v-if="data.item.header === ''">
                    <v-icon :color="data.item.color">
                      {{ data.item.icon }}
                    </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content v-if="data.item.header === ''">
                    {{ data.item.name }}
                  </v-list-item-content>
                </template>
              </v-select>
              <v-btn icon @click="change()">
                <v-icon color="primary">mdi-filter-variant</v-icon>
              </v-btn>
            </div>
            <div
              v-if="
                radioGroup === 0 && !createContactOnly && selectedActiveGroup
              "
            >
              <v-card
                class="ml-0 mt-2 overflow-y-auto"
                max-width="324"
                height="200"
                elevation="4"
              >
                <v-list dense class="px-2">
                  <v-subheader>{{ selectedType.name }}</v-subheader>
                  <v-list-item-group
                    v-model="selectedItem"
                    color="primary"
                    @change="changeSelectedContact()"
                  >
                    <v-list-item
                      v-for="item in contactListFilter"
                      :key="item.id"
                    >
                      <v-list-item-content>{{ item.name }}</v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </div>
            <div v-else-if="radioGroup === 1 || createContactOnly">
              <v-form v-model="validContact">
                <v-text-field
                  v-model="newContactName"
                  outlined
                  type="text"
                  label="Nombre"
                  placeholder="Ingresar nombre"
                  :rules="nameRules"
                />
                <div class="d-flex">
                  <div class="phone-prefix-uno">
                    <v-select
                      v-model="prefijo"
                      :items="countries"
                      label="Código de área"
                      :rules="prefixRules"
                      item-text="prefix"
                      item-value="prefix"
                      return-object
                      placeholder="Seleccionar código de área"
                      outlined
                    >
                      <template v-slot:item="slotProps">
                        <i :class="['mr-2', 'em', slotProps.item.flag]"></i>
                        {{ slotProps.item.name }} (+{{ slotProps.item.prefix }})
                      </template>
                    </v-select>
                  </div>
                  <div class="phone-prefix-dos">
                    <v-text-field
                      v-model="phone"
                      label="Número"
                      placeholder="Ingresar número"
                      type="text"
                      outlined
                      :rules="phoneRules"
                      @keypress="onlyNumbers"
                    />
                  </div>
                </div>
              </v-form>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-center py-6">
        <v-btn color="primary" outlined @click="closeDialog()">
          CANCELAR
        </v-btn>
        <v-btn
          color="primary"
          :disabled="disableCreateChat"
          @click="createBtn()"
        >
          {{ createContactOnly ? 'CREAR CONTACTO' : 'ir a cHAT' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import validationMixin from '@/mixins/validation/validationMixin'

export default {
  name: 'NewChatAndContactDialog',
  mixins: [whatsappBffMixin, validationMixin, adminBffMixin],
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    createContactOnly: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    loading: false,
    radioGroup: 0,
    selectedContactId: null,
    selectedItem: null,
    selectedActiveGroup: false,
    validContact: false,
    newContactName: '',
    newContactPhone: '',
    activeGroup: false,
    contactList: [],
    chatLabelList: [],
    selectedType: [],
    contactListFilter: [],
    prefijo: null,
    phone: '',
    countries: [],
  }),
  computed: {
    ...mapGetters(['clientId']),
    nameRules() {
      return [(v) => this.isRequired(v, ''), (v) => this.minLength(v, 3)]
    },
    phoneRules() {
      return [
        (v) => this.isRequired(v, 'Teléfono'),
        (v) => this.minLength(v, 5),
      ]
    },
    prefixRules() {
      return [(v) => this.isRequired(v, '')]
    },
    disableCreateChat() {
      if (this.radioGroup === 0 && !this.createContactOnly)
        return !this.selectedContactId
      return !this.validContact
    },
  },
  async mounted() {
    this.loading = true
    this.countries = await this.getAllFlagsPrefix()
    this.getContacts()
    const labelList = await this.getLabelsListByClientId(this.clientId)
    let titulo = {
      header: 'Chats',
      id: 'titulo1',
      name: '',
      icon: '',
      color: '',
    }
    this.chatLabelList.push(titulo)
    titulo = {
      header: '',
      id: 'myChats',
      name: 'Mis chats',
      icon: 'mdi-message-reply-text-outline',
      color: '#0093B1',
    }
    this.chatLabelList.push(titulo)
    titulo = {
      header: '',
      id: 'assigned',
      name: 'Asignados',
      icon: 'mdi-account-multiple-outline',
      color: '#0093B1',
    }
    this.chatLabelList.push(titulo)
    titulo = {
      header: '',
      id: 'notAssigned',
      name: 'No asignados',
      icon: 'mdi-account-multiple-minus-outline',
      color: '#0093B1',
    }
    this.chatLabelList.push(titulo)
    titulo = {
      header: '',
      id: 'historical',
      name: 'Históricos',
      icon: 'mdi-inbox-arrow-down-outline',
      color: '#0093B1',
    }
    this.chatLabelList.push(titulo)
    titulo = {
      header: '',
      id: 'mailingLists',
      name: 'Listas de difusión',
      icon: 'mdi-bullhorn-variant-outline',
      color: '#0093B1',
    }
    this.chatLabelList.push(titulo)
    titulo = {
      header: 'Etiquetas',
      id: 'titulo2',
      name: '',
      icon: '',
      color: '',
    }
    this.chatLabelList.push(titulo)
    labelList.forEach((item) => {
      titulo = {
        header: '',
        id: item.id,
        name: item.name,
        icon: 'mdi-label',
        color: item.color,
      }
      this.chatLabelList.push(titulo)
    })
    this.loading = false
  },
  methods: {
    async getContacts() {
      const params = {
        page: -1,
      }
      const contactsTMP = await this.getContactsByClient(params)
      this.contactList = contactsTMP.dataList
    },
    async changeSelectedType() {
      const type = this.selectedType.id
      let typeI = ''
      let senderI = ''
      if (
        type === 'myChats' ||
        type === 'assigned' ||
        type === 'notAssigned' ||
        type === 'historical' ||
        type === 'mailingLists'
      ) {
        typeI = type
      } else {
        senderI = type
      }
      const filter = {
        clientId: this.clientId,
        pageConversation: typeI,
        senderId: senderI,
        page: -1,
      }
      console.log('fitro: ', filter)
      const chatsObj = await this.getChatsFilter(filter)
      this.contactListFilter = chatsObj.dataList
      this.selectedActiveGroup = true
    },
    change() {
      this.selectedActiveGroup = false
      this.activeGroup = !this.activeGroup
    },
    changeSelectedContact() {
      this.selectedContactId = this.contactListFilter[this.selectedItem].id
      this.createBtn()
    },
    closeDialog() {
      this.loading = false
      this.radioGroup = 0
      this.selectedContactId = null
      this.newContactName = ''
      this.newContactPhone = ''
      this.$emit('change-model', false)
    },
    createBtn() {
      if (this.createContactOnly) {
        this.newContactPhone = `${this.prefijo.prefix}${this.phone}`
        this.$emit('create-contact', {
          name: this.newContactName,
          phone: this.newContactPhone,
        })
      } else if (this.radioGroup === 0) {
        this.$emit('create-chat', { id: this.selectedContactId })
      } else if (this.radioGroup === 1) {
        this.newContactPhone = `${this.prefijo.prefix}${this.phone}`
        this.$emit('create-contact-and-chat', {
          name: this.newContactName,
          phone: this.newContactPhone,
        })
      }
      this.loading = false
      this.radioGroup = 0
      this.selectedContactId = null
      this.newContactName = ''
      this.newContactPhone = ''
      this.activeGroup = false
      this.selectedActiveGroup = false
    },
    remove() {
      this.selectedType = []
      this.activeGroup = !this.activeGroup
      this.selectedActiveGroup = false
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
.phone-prefix-uno {
  width: 45%;
}
.phone-prefix-dos {
  width: 55%;
}
.transition {
  -webkit-animation: jello-horizontal 0.5s both;
  animation: jello-horizontal 0.5s both;
}
@-webkit-keyframes jello-horizontal {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  30% {
    -webkit-transform: scale(0.25);
    transform: scale(0.25);
  }
  40% {
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
  }
  50% {
    -webkit-transform: scale(0.75);
    transform: scale(0.75);
  }
  65% {
    -webkit-transform: scale(0.95);
    transform: scale(0.95);
  }
  75% {
    -webkit-transform: scale(1.05);
    transform: scale(1.05);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
