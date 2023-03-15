<template>
  <v-container class="ml-0" style="max-width: 1296px">
    <v-col>
      <v-row v-if="!creationSuccess">
        <v-stepper v-model="e6" vertical>
          <h1 class="ml-5 mt-5">Creación de Cliente</h1>
          <v-stepper-step :complete="e6 > 1" step="1" :editable="valid">
            Información Cliente
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-form ref="form" v-model="valid">
              <create-client-form :client="client" />
            </v-form>
            <v-row class="mt-2 mb-5" no-gutters>
              <v-col>
                <v-btn
                  class="font-weight-bold ml-3"
                  color="primary"
                  elevation="0"
                  outlined
                  @click="$router.push({ name: 'Clients' })"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  class="font-weight-bold ml-3"
                  color="primary"
                  :disabled="!valid"
                  elevation="0"
                  @click="e6 = 2"
                >
                  Continuar
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>
          <v-stepper-step :complete="e6 > 2" step="2" :editable="valid">
            Habilitación de servicios
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-row no-gutters class="pa-5">
              <div
                v-for="servicesModule in client.servicesAvalibleList"
                :key="servicesModule.name"
                class="cards-cols mb-4"
              >
                <v-card
                  class="d-flex flex-wrap pa-4 my-1 ml-4 px-auto cards-width"
                >
                  <v-col cols="12">
                    <v-switch v-model="servicesModule.value">
                      <template v-slot:label>
                        <div class="pl-5 accent--text text-h6">
                          {{ servicesModule.appName }}
                        </div>
                      </template>
                    </v-switch>
                  </v-col>
                  <v-col
                    :class="
                      servicesModule.value ? 'primary--text' : 'gray300--text'
                    "
                    cols="12"
                  >
                    Configuración servicio
                    <v-btn
                      icon
                      :disabled="!servicesModule.value"
                      @click="moduleActive(servicesModule)"
                    >
                      <v-icon color="primary">mdi-pencil</v-icon>
                    </v-btn>
                  </v-col>
                </v-card>
                <div class="d-flex justify-center show-items mt-5">
                  <div v-if="servicesModule.active" class="mt-n7 mb-n4">
                    <v-icon
                      size="80"
                      color="primary"
                      class="show-icon mt-4 mb-n4"
                    >
                      mdi-menu-up
                    </v-icon>
                  </div>
                  <v-icon v-else x-large color="white" class="show-icon">
                    mdi-menu-up
                  </v-icon>
                </div>
              </div>
            </v-row>
            <v-row class="mt-10">
              <v-fade-transition hide-on-leave>
                <service-sms
                  v-if="serviceSelected === 'SMS'"
                  :service-object="client.servicesAvalibleConfig.sms"
                />
              </v-fade-transition>
              <v-fade-transition hide-on-leave>
                <service-vms
                  v-if="serviceSelected === 'VMS'"
                  :vms-object="client.servicesAvalibleConfig.vms"
                />
              </v-fade-transition>
              <v-fade-transition hide-on-leave>
                <service-mailing
                  v-if="serviceSelected === 'Mailing'"
                  :mailing-object="client.servicesAvalibleConfig.mailing"
                />
              </v-fade-transition>
              <v-fade-transition hide-on-leave>
                <service-whatsapp
                  v-if="serviceSelected === 'Whatsapp'"
                  :whatsapp-object="client.servicesAvalibleConfig.whatsapp"
                />
              </v-fade-transition>
            </v-row>
            <v-row class="mt-10">
              <v-col>
                <v-btn color="primary" outlined class="mr-5" elevation="0">
                  cancelar
                </v-btn>
                <v-btn
                  color="primary"
                  elevation="0"
                  @click="submitCreateClient()"
                >
                  {{ this.$route.params.id ? 'Guardar' : 'Crear' }}
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>
        </v-stepper>
      </v-row>
      <v-row v-else-if="creationSuccess">
        <v-col cols="9">
          <v-row>
            <v-alert outlined type="success" class="red--text">
              ¡Se ha creado el cliente con éxito!
            </v-alert>
          </v-row>
          <v-row class="pt-10">
            <v-btn color="primary" @click="goToClientsList('Clients')">
              IR AL LISTADO DE CLIENTES
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import CreateClientForm from '@/components/modules/settings/CreateClientForm.vue'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import ServiceSms from '@/components/modules/settings/clientServices/ServiceSMS.vue'
import ServiceVms from '@/components/modules/settings/clientServices/ServiceVMS.vue'
import ServiceMailing from '@/components/modules/settings/clientServices/ServiceMailing.vue'
import ServiceWhatsapp from '@/components/modules/settings/clientServices/ServiceWhatsapp.vue'

export default {
  name: 'CreateClient',
  components: {
    CreateClientForm,
    ServiceSms,
    ServiceVms,
    ServiceMailing,
    ServiceWhatsapp,
  },
  mixins: [adminBffMixin],
  data() {
    return {
      e6: 1,
      client: {
        servicesAvalibleConfig: {
          sms: {
            blacklistWords: [],
            receiverNumbers: [],
          },
          vms: {},
          mailing: {},
          whatsapp: {},
        },
        servicesAvalibleList: [
          {
            name: 'SMS',
            value: false,
            active: false,
          },
          {
            name: 'VMS',
            value: false,
            active: false,
          },
          {
            name: 'Mailing',
            value: false,
            active: false,
          },
          {
            name: 'Whatsapp',
            value: false,
            active: false,
          },
        ],
      },
      valid: true,
      creationSuccess: false,
      serviceSelected: '',
    }
  },
  async mounted() {
    if (this.$route.params.id) {
      this.client = await this.getClientById(this.$route.params.id)
      const blacklistWords = this.stringListToObjectList(
        this.client.servicesAvalibleConfig.sms.blacklistWords
      )
      this.client.servicesAvalibleConfig.sms.blacklistWords = blacklistWords
      const receiverNumbers = this.stringListToObjectList(
        this.client.servicesAvalibleConfig.sms.receiverNumbers
      )
      this.client.servicesAvalibleConfig.sms.receiverNumbers = receiverNumbers
      const senders = this.stringListToObjectList(
        this.client.servicesAvalibleConfig.sms.senders
      )
      this.client.servicesAvalibleConfig.sms.senders = senders
      //
      this.activeModule()
    } else {
      this.getApps()
    }
  },
  methods: {
    activeModule() {
      if (this.client.servicesAvalibleList.length) {
        this.client.servicesAvalibleList.forEach((element) => {
          if (element.active) this.moduleActive(element)
        })
      }
    },
    objectListToStringList(array) {
      const stringlist = []
      if (array.length) {
        array.forEach((element) => {
          stringlist.push(element.value)
        })
      }
      return stringlist
    },
    stringListToObjectList(array) {
      const objectlist = []
      let id = 1
      if (array.length) {
        array.forEach((element) => {
          objectlist.push({ id, value: element })
          id += 1
        })
      }
      return objectlist
    },
    submitCreateClient() {
      const blacklistWords = this.objectListToStringList(
        this.client.servicesAvalibleConfig.sms.blacklistWords
      )
      this.client.servicesAvalibleConfig.sms.blacklistWords = blacklistWords
      const receiverNumbers = this.objectListToStringList(
        this.client.servicesAvalibleConfig.sms.receiverNumbers
      )
      this.client.servicesAvalibleConfig.sms.receiverNumbers = receiverNumbers
      const senders = this.objectListToStringList(
        this.client.servicesAvalibleConfig.sms.senders
      )
      this.client.servicesAvalibleConfig.sms.senders = senders
      if (this.$refs.form.validate()) {
        const objClient = {
          id: this.client.id,
          address: this.client.address,
          city: this.client.city,
          email: this.client.email,
          legalName: this.client.legalName,
          maxfilesize: this.client.maxfilesize,
          name: this.client.name,
          phone: this.client.phone,
          resellerId: this.client.reseller.id,
          rut: this.client.rut,
          town: this.client.town,
          format: {
            country: this.client.country,
            countryCode: this.client.country.code,
            timezone: this.client.timezone,
            locale: this.client.locale,
            language: this.client.locale.locale.split('_')[0],
          },
          servicesAvalibleConfig: this.client.servicesAvalibleConfig,
          servicesAvalibleList: this.client.servicesAvalibleList,
        }
        this.createClient(objClient)
          .then(() => {
            this.creationSuccess = true
          })
          .catch(() => {
            this.creationSuccess = false
          })
      }
    },
    goToClientsList(route) {
      this.$router.push({
        name: route,
      })
    },
    moduleActive(serviceModule) {
      const indexModule =
        this.client.servicesAvalibleList.indexOf(serviceModule)
      this.client.servicesAvalibleList.forEach((item, index) => {
        if (index === indexModule) {
          item.active = true
          this.serviceSelected = item.appName
        } else item.active = false
      })
    },
    async getApps() {
      this.client.servicesAvalibleList = await this.getApplicationAvalible()
    },
  },
}
</script>
<style scoped>
.cards-cols {
  width: 220px;
}
.cards-width {
  width: 200px;
}
.show-items {
  display: block;
  border-bottom: 2px solid var(--v-primary-base);
}
.show-icon {
  display: block;
}
.custom-width {
  min-width: 1296px;
  width: 1296px;
}

.poligono {
  background-color: black;
  width: 30px;
  height: 30px;
  clip-path: polygon(50% 0, 0% 100%, 4% 100%, 50% 11%, 95% 100%, 100% 100%);
}

@media (max-width: 1094px) {
  .show-items {
    display: none;
    border-bottom: none;
  }
  .show-icon {
    display: none;
  }
  .custom-width {
    width: calc(100vw - 65px);
  }
}
</style>
