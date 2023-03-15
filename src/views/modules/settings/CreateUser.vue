<template>
  <div>
    <div class="pa-7 text-h4">Creación de usuario</div>
    <v-stepper v-if="!creationSuccess" v-model="currentStep" flat vertical>
      <v-stepper-step
        :complete="currentStep > 1"
        step="1"
        :editable="stepsEditables.first"
        class="text-h5"
      >
        Datos generales
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-skeleton-loader
          v-if="skeletonLoader"
          type="card-heading, list-item-three-line, list-item-three-line, actions"
        />
        <create-user-form
          v-else
          class="screenWidth"
          :user-form-obj="user"
          :clients="clients"
          @create-new-user="addUserForm($event)"
        />
      </v-stepper-content>

      <v-stepper-step
        :complete="currentStep > 2"
        step="2"
        :editable="stepsEditables.second"
        class="text-h5"
      >
        Configuración cuenta
      </v-stepper-step>
      <v-stepper-content step="2">
        <create-user-config :user-obj="user" />
        <div class="mt-10 mb-5">
          <v-btn outlined color="primary" @click="goToUsersList('Users')">
            Cancelar
          </v-btn>
          <v-btn class="ml-5" color="primary" @click="currentStep = 3">
            Continuar
          </v-btn>
        </div>
      </v-stepper-content>

      <v-stepper-step
        :complete="currentStep > 3"
        step="3"
        :editable="stepsEditables.third"
        class="text-h5"
      >
        Asignaciones de Roles
      </v-stepper-step>

      <v-stepper-content step="3">
        <role-selector v-if="roles" :roles="roles" :user-role="user" />
        <div class="my-5">
          <v-btn outlined color="primary" @click="goToUsersList('Users')">
            Cancelar
          </v-btn>
          <v-btn
            class="ml-5"
            color="primary"
            :disabled="Object.keys(user.role).length === 0"
            @click="currentStep = 4"
          >
            Continuar
          </v-btn>
        </div>
      </v-stepper-content>

      <v-stepper-step
        :complete="currentStep > 4"
        step="4"
        :editable="stepsEditables.fourth"
        class="text-h5"
      >
        Api token
      </v-stepper-step>

      <v-stepper-content step="4">
        <v-row dense no-gutters>
          <v-col>
            <v-switch
              v-model="user.apiToken.apiEnabled"
              class="ml-3"
              flat
              label="Usar API"
            />
          </v-col>
        </v-row>
        <v-expand-transition>
          <v-row v-if="user.apiToken.apiEnabled" dense>
            <v-col>
              <v-checkbox
                v-model="user.apiToken.tokenLimited"
                class="ml-3"
                flat
                label="Usar API Token limitado"
              />
            </v-col>
          </v-row>
        </v-expand-transition>
        <v-form v-model="apiTokenForm">
          <v-expand-transition>
            <v-row
              v-show="user.apiToken.apiEnabled && user.apiToken.tokenLimited"
              class="ml-3"
              no-gutters
            >
              <v-col cols="12" class="my-5 accent--text">
                Asignar duración del Token limitado. Ingresa desde 1 hasta 24
                meses.
              </v-col>
              <v-col lg="1" md="4" sm="8">
                <v-text-field
                  v-model="user.apiToken.tokenExpiration"
                  :rules="monthTokenRules"
                  label="Cantidad de meses"
                  placeholder="Ingresar cantidad de meses"
                  type="number"
                  outlined
                />
              </v-col>
            </v-row>
          </v-expand-transition>
        </v-form>
        <v-row
          v-if="this.$route.params.id !== 'create' && user.apiToken.token"
          class="ml-3 divCustomWidth"
          no-gutters
        >
          <v-col cols="12">
            <v-card color="gray100" class="pa-1" outlined>
              <v-row class="justify-space-between pa-5">
                <v-col class="d-flex">
                  <p class="font-weight-bold mr-2">
                    {{
                      user.apiToken.tokenLimited
                        ? 'API TOKEN VENCE EL:'
                        : 'API TOKEN ILIMITADO'
                    }}
                  </p>
                  <p v-if="user.apiToken.message !== undefined">
                    {{ user.apiToken.message }}
                  </p>
                </v-col>
                <v-col class="d-flex justify-end mr-2 pt-1">
                  <v-btn
                    text
                    class="primary--text"
                    @click="changeusertokenDialog = true"
                  >
                    <v-icon class="mr-2">mdi-sync</v-icon>
                    GENERAR NUEVO
                  </v-btn>
                  <v-btn icon class="mx-5" @click="showToken = !showToken">
                    <v-icon color="primary">mdi-eye</v-icon>
                  </v-btn>
                  <v-tooltip v-model="showCopied" nudge-right="8" right>
                    <template v-slot:activator="{}">
                      <v-btn icon @click="copyToClipboard(user.apiToken.token)">
                        <v-icon color="primary">mdi-content-copy</v-icon>
                      </v-btn>
                    </template>
                    <span>Copiado!</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-expand-transition>
                <v-row class="mt-n8 pa-2">
                  <v-col class="font-weight-regular" cols="12">
                    <v-textarea
                      rows="2"
                      background-color="gray100"
                      :auto-grow="showToken"
                      no-resize
                      readonly
                      single-line
                      flat
                      solo
                      :value="user.apiToken.token"
                      style="border-style: none !important"
                    />
                  </v-col>
                </v-row>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="my-5 ml-2">
          <v-btn
            color="primary"
            :disabled="!apiTokenForm && user.apiToken.tokenLimited"
            @click="submitCreateUser(user)"
          >
            Crear usuario
          </v-btn>
          <v-progress-circular
            v-if="loading"
            class="ml-12"
            indeterminate
            color="primary"
          >
          </v-progress-circular>
        </v-row>
      </v-stepper-content>
    </v-stepper>
    <v-row v-else-if="creationSuccess && !creationError" class="pa-2">
      <v-col cols="12">
        <v-row>
          <v-col md="3" sm="12">
            <v-alert outlined type="success" class="red--text">
              ¡Se ha creado el usuario con éxito!
            </v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn color="primary" @click="goToUsersList('Users')">
              IR AL LISTADO DE USUARIOS
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="creationError" class="pa-2">
      <v-col cols="12">
        <v-row>
          <v-col md="3" sm="12">
            <v-alert outlined type="Error" class="red--text">
              ¡Ha ocurrido un error!
            </v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn color="primary" @click="goToUsersList('Users')">
              IR AL LISTADO DE USUARIOS
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="changeusertokenDialog" width="25%">
      <v-card>
        <v-card-title class="text-h5 lighten-2 justify-center">
          Generar API TOKEN
        </v-card-title>

        <v-card-text>
          <v-row class="mb-2 py-2">
            <v-col class="d-flex justify-center">
              Elija los parámetros para la generación del nuevo Token:
            </v-col>
          </v-row>
          <v-row no-gutters dense>
            <v-col>
              <v-switch
                v-model="dialogUserApiTokenLimited"
                flat
                label="Usar Token limitado"
              />
            </v-col>
          </v-row>
          <v-row dense no-gutters>
            <v-col sm="12" md="6">
              <v-text-field
                v-model="dialogUserApiTokenExpiration"
                label="Cantidad de meses"
                placeholder="Ingresar cantidad de meses"
                type="number"
                :disabled="!dialogUserApiTokenLimited"
                outlined
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            outlined
            color="primary"
            @click="changeusertokenDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn color="primary" @click="getNewUserToken()"> Actualizar </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import RoleSelector from '@/components/modules/settings/RoleSelector.vue'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import CreateUserForm from '@/components/modules/settings/CreateUserForm.vue'
import CreateUserConfig from '@/components/modules/settings/CreateUserConfig.vue'
import validationMixin from '@/mixins/validation/validationMixin'

export default {
  components: { CreateUserForm, CreateUserConfig, RoleSelector },
  mixins: [adminBffMixin, validationMixin],
  data() {
    return {
      currentStep: 1,
      apiTokenForm: false,
      showToken: false,
      changeusertokenDialog: false,
      changeusertokenDialogText: '',
      dialogUserApiTokenLimited: false,
      dialogUserApiTokenExpiration: '',
      showCopied: false,
      skeletonLoader: false,
      isApiEnabled: false,
      isTokenLimited: false,
      tokenMonthExpiration: '',
      expand: false,
      user: {
        id: null,
        client: {},
        clients: [],
        given_name: '',
        family_name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        config: {
          enabled: false,
          mailNotification: false,
          expiredPassword: false,
          blocked: false,
          refreshPassword: false,
          enablePassword: false,
          expiredAccount: false,
        },
        role: {},
        apiToken: {
          apiEnabled: false,
          tokenLimited: false,
          tokenExpiration: 0,
        },
      },
      apiTokenDataTableHeaders: [
        { text: 'Cliente', value: 'name', sortable: false },
        { text: 'Token', value: 'token', sortable: false },
      ],
      roles: [],
      clients: [],
      creationSuccess: false,
      creationError: false,
      loading: false,
      stepsEditables: {
        first: false,
        second: false,
        third: false,
        fourth: false,
      },
    }
  },
  computed: {
    ...mapGetters(['clientId', 'resellerId']),
    monthTokenRules() {
      return [(v) => this.valueBetween(v, 1, 24)]
    },
  },
  watch: {
    currentStep: {
      handler(value) {
        if (value === 2) this.stepsEditables.first = true
        if (value === 3) this.stepsEditables.second = true
        if (value === 4) {
          this.stepsEditables.third = true
          this.stepsEditables.fourth = true
        }
      },
    },
    'user.apiToken.apiEnabled': {
      handler(value) {
        if (!value) {
          this.user.apiToken.tokenLimited = false
          this.user.apiToken.tokenExpiration = 0
        }
      },
    },
  },
  async created() {
    this.getRoles()
  },
  async mounted() {
    this.skeletonLoader = true
    this.getClients()
    this.skeletonLoader = false
  },
  methods: {
    addUserForm() {
      console.log(this.user)
      this.currentStep = 2
    },
    async getRoles() {
      if (this.clientId) {
        this.roles = await this.getRolesAndGroupedPermissionByClientId()
      }
    },
    async getClients() {
      const clientsTMP = await this.getUsersInit()
      this.clients = clientsTMP.clientList
    },
    goToUsersList(route) {
      this.$router.push({ name: route })
    },
    async submitCreateUser(u) {
      let response = null
      if (u) {
        this.loading = true
        const clientListToSend = u.clients.map((client) => client.id)
        const userToSend = {
          email: u.email,
          password: u.password,
          phone: u.phone,
          givenName: u.givenName,
          familyName: u.familyName,
          clientIds: clientListToSend,
          defaultClient: u.defaultClient,
          apiToken: u.apiToken,
          roleId: u.role.id,
          id: u.id,
          config: u.config,
        }

        response = await this.createUser(userToSend)

        if (response) {
          this.creationSuccess = true
          this.creationError = false
          this.loading = false
        } else {
          this.creationSuccess = false
          this.creationError = true
          this.loading = false
        }
      }
    },
    copyToClipboard(str) {
      navigator.clipboard.writeText(str)
      this.showCopied = true
      setTimeout(() => {
        this.showCopied = false
      }, 1000)
    },
    async getNewUserToken() {
      const userTokenObject = {
        apiToken: {
          apiEnabled: true,
          tokenLimited: this.dialogUserApiTokenLimited,
          tokenExpiration: this.dialogUserApiTokenExpiration,
        },
      }
      this.user.apiToken = await this.updateUserApiToken(
        userTokenObject,
        this.user.id
      )
      this.changeusertokenDialog = false
    },
    cleanUserApiToken() {
      this.user.apiToken = {
        apiEnabled: false,
        tokenLimited: false,
        tokenExpiration: '',
      }
    },
  },
}
</script>
<style scoped>
@media only screen and (min-width: 1920px) {
  .divCustomWidth {
    max-width: 40%;
  }
  .clientApi {
    max-width: 60%;
  }
  .screenWidth {
    max-width: 50%;
  }
}
@media only screen and (max-width: 1920px) {
  .divCustomWidth {
    max-width: 50%;
  }
  .clientApi {
    max-width: 60%;
  }
  .screenWidth {
    max-width: 50%;
  }
}
@media only screen and (max-width: 1366px) {
  .divCustomWidth {
    max-width: 70%;
  }
  .clientApi {
    max-width: 80%;
  }
}
@media only screen and (max-width: 800px) {
  .divCustomWidth {
    max-width: 70%;
  }
  .clientApi {
    max-width: 80%;
  }
  .screenWidth {
    max-width: 100%;
  }
}
</style>
