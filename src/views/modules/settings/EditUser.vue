<template>
  <div class="pa-5">
    <v-row>
      <v-col cols="12" class="text-h4">
        <v-btn text color="primary" @click="$router.push({ name: 'Users' })">
          <v-icon class="mr-2">mdi-arrow-left</v-icon>
          Volver a usuarios
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-h4">Editar usuario</v-col>
    </v-row>
    <v-row class="mt-10">
      <v-tabs v-model="actualTab" align-with-title>
        <v-tabs-slider color="primary"></v-tabs-slider>

        <v-tab v-for="item in tabHeaders" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="actualTab">
        <v-tab-item class="ml-8">
          <v-row>
            <v-col
              v-if="user.givenName !== '' && user.familyName !== ''"
              class="pa-5"
              md="6"
              sm="12"
            >
              <edit-user-form :user-form-obj="user" :clients="clients" />
            </v-col>
            <v-col v-else cols="12">
              <v-skeleton-loader type="article, article, article, actions" />
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item class="ml-8">
          <v-row>
            <v-col class="pa-5" md="6" sm="12">
              <create-user-config :user-obj="user" />
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item class="ml-12">
          <v-row>
            <v-col class="pa-5" md="12" sm="12">
              <role-selector
                v-if="Object.keys(user.role).length"
                :roles="roles"
                :user-role="user"
              />
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item class="ml-12">
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
                <v-col lg="3" md="4" sm="8">
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
            class="ml-3"
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
                        <v-btn
                          icon
                          @click="copyToClipboard(user.apiToken.token)"
                        >
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
          <v-row
            v-if="$route.params.id !== 'create' && user.clients.length > 0"
            class="mt-8 mb-10 ml-1"
            no-gutters
          >
            <v-col cols="12">
              <v-data-table
                :headers="apiTokenDataTableHeaders"
                :items="user.clients"
                :hide-default-footer="true"
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn plain @click="changeUserToken(item)">
                    <v-icon>mdi-sync</v-icon>-
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-row>
    <v-row class="pa-7">
      <v-col md="12" sm="12">
        <v-btn
          outlined
          elevation="0"
          color="primary"
          class="mr-5"
          @click="$router.push({ name: 'Users' })"
        >
          CANCELAR
        </v-btn>
        <v-btn
          color="primary"
          elevation="0"
          :disabled="!userChanges"
          @click="submitEditUser(user)"
        >
          GUARDAR
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="changeusertokenDialog" persistent width="25%">
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
          <v-btn outlined color="primary" @click="cleanRefreshApiToken()">
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
import adminBffMixin from '@/mixins/services/adminBffMixin'
import validationMixin from '@/mixins/validation/validationMixin'
import EditUserForm from '@/components/modules/settings/EditUserForm.vue'
import CreateUserConfig from '@/components/modules/settings/CreateUserConfig.vue'
import RoleSelector from '@/components/modules/settings/RoleSelector.vue'

export default {
  name: 'EditUser',
  components: { EditUserForm, CreateUserConfig, RoleSelector },
  mixins: [adminBffMixin, validationMixin],

  data() {
    return {
      actualTab: null,
      tabHeaders: [
        'DATOS GENERALES',
        'CONFIGURACIÓN CUENTA',
        'ROLES Y PERMISOS',
        'API TOKEN',
      ],
      apiTokenDataTableHeaders: [
        { text: 'Cliente', value: 'name', sortable: false },
        { text: 'Token', value: 'token', sortable: false },
      ],
      clients: [],
      user: {
        id: null,
        client: {},
        clients: [],
        givenName: '',
        familyName: '',
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
      roles: [],
      isApiEnabled: false,
      isTokenLimited: false,
      tokenMonthExpiration: '',
      apiTokenForm: false,
      showToken: false,
      //
      changesUserObj: {},
      connectionCompleted: false,
      userChanges: false,
      //
      changeusertokenDialog: false,
      changeusertokenDialogText: '',
      dialogUserApiTokenLimited: false,
      dialogUserApiTokenExpiration: '',
      showCopied: false,
      userNameAux: {
        userGivenName: '',
        userFamilyName: '',
      },
    }
  },
  computed: {
    monthTokenRules() {
      return [(v) => this.valueBetween(v, 1, 24)]
    },
  },
  watch: {
    user: {
      handler() {
        if (this.connectionCompleted && this.changesUserObj !== this.user) {
          this.userChanges = true
        } else this.userChanges = false
      },
      deep: true,
    },
  },
  async created() {
    this.getRoles()
  },

  async mounted() {
    this.getClients()
    const objUser = await this.getUserById(this.$route.params.id).finally(
      () => {
        this.connectionCompleted = true
      }
    )
    this.user = objUser.metadata.app_metadata.infoForm

    if (this.user.familyName === undefined) {
      this.user.familyName = objUser.family_name
    }
    if (this.user.givenName === undefined) {
      this.user.givenName = objUser.given_name
    }
    if (this.user.email === undefined) {
      this.user.email = objUser.email
    }
    if (this.user.phone === undefined) {
      this.user.phone = ''
    }
    if (this.user.apiToken === undefined) {
      this.user.apiToken = {
        apiEnabled: false,
        tokenLimited: false,
        tokenExpiration: 0,
      }
    }
    this.userNameAux.userGivenName = this.user.givenName
    this.userNameAux.userFamilyName = this.user.familyName
    this.changesUserObj = structuredClone(this.user)
  },

  methods: {
    async getRoles() {
      this.roles = await this.getRolesAndGroupedPermissionByClientId()
    },
    async getClients() {
      const clientsTMP = await this.getUsersInit()
      this.clients = clientsTMP.clientList
    },
    initials() {
      const ini =
        this.user.givenName.substr(0, 1) + this.user.familyName.substr(0, 1)
      return ini
    },
    async submitEditUser(u) {
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

        response = await this.editUser(userToSend)
        if (response) {
          this.creationSuccess = true
          this.creationError = false
          this.loading = false
          this.$store.commit('alert', {
            type: 'success',
            text: '¡Usario editado correctamente!',
          })
        } else {
          this.creationSuccess = false
          this.creationError = true
          this.loading = false
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Error al editar usuario!',
          })
        }
        this.$router.go()
      }
    },
    async getNewUserToken() {
      const userTokenObject = {
        apiEnabled: true,
        tokenLimited: this.dialogUserApiTokenLimited,
        tokenExpiration: this.dialogUserApiTokenExpiration,
      }
      this.user.apiToken = await this.updateUserApiToken(
        userTokenObject,
        this.user.id
      )
      this.cleanRefreshApiToken()
    },
    cleanRefreshApiToken() {
      this.changeusertokenDialog = false
      this.dialogUserApiTokenLimited = false
      this.dialogUserApiTokenExpiration = ''
    },
    copyToClipboard(str) {
      navigator.clipboard.writeText(str)
      this.showCopied = true
      setTimeout(() => {
        this.showCopied = false
      }, 1000)
    },
  },
}
</script>

<style scoped>
.style-chip {
  text-align: center;
  background-color: var(--v-primary100-base);
  border-radius: 16px;
  font-size: 14px;
  line-height: 20px;
  padding: 6px 12px;
  height: 32px;
  max-width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
