<template>
  <div class="pa-5">
    <v-row>
      <v-col class="mb-4 text-h4"> Crear Rol </v-col>
    </v-row>
    <v-row align="center" justify="space-between">
      <v-col> Ingresa un nombre y elige los permisos para el rol. </v-col>
    </v-row>
    <v-row align="center" justify="space-between">
      <v-col md="6" sm="12">
        <v-text-field
          v-model="role.roleName"
          label="Nombre"
          placeholder="Ingresa un nombre al rol"
          outlined
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col> Selecciona los permisos que tendrá este rol </v-col>
    </v-row>
    <v-row v-if="role.permissions">
      <v-col>
        <permission-selector
          :permissions="role.permissions"
          :is-switch-disabled="false"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          color="primary"
          outlined
          @click="
            $router.push({
              name: 'Roles',
            })
          "
          >cancelar</v-btn
        >
        <v-btn class="ml-5" color="primary" @click="createRole()">crear</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import adminBffMixin from '@/mixins/services/adminBffMixin'
import PermissionSelector from '@/components/modules/settings/PermissionSelector.vue'

export default {
  name: 'CreateRole',
  components: { PermissionSelector },
  mixins: [adminBffMixin],
  data() {
    return {
      role: {
        roleName: '',
        permissions: null,
      },
    }
  },
  mounted() {
    this.getPermissions()
  },
  methods: {
    async getPermissions() {
      this.role.permissions = await this.getAllowedRolesByClient()
    },
    async createRole() {
      const permissionList = []
      Object.values(this.role.permissions).forEach((permissionArray) => {
        permissionArray.forEach((permissionObject) => {
          permissionList.push({
            permissionId: permissionObject.id,
            isChecked: permissionObject.checked,
          })
        })
      })
      const roleToSend = {
        roleName: this.role.roleName,
        permissions: permissionList,
      }
      await this.createRolePermission(roleToSend)
      this.$router.push({
        name: 'Roles',
      })
    },
  },
}
</script>
