<template>
  <v-container>
    <div style="width: 90%">
      <div class="mb-4 text-h4">Roles y Permisos</div>
      <v-row align="center" justify="space-between">
        <v-col> Aquí podrás crear roles y asignar permisos en cada uno. </v-col>
        <div class="mr-3">
          <v-btn
            color="primary"
            @click="
              $router.push({
                name: 'CreateRole',
              })
            "
          >
            <v-icon>mdi-plus</v-icon>
            <div class="mx-4 font-weight-regular">Crear Rol</div>
          </v-btn>
        </div>
      </v-row>
      <v-row class="mt-10">
        <v-col v-for="role in roles" :key="role.id" cols="12">
          <v-container
            class="gray d-flex justify-space-between"
            style="cursor: pointer"
            @click="roleShow(role)"
          >
            <div class="ml-2">{{ role.name }}</div>
            <v-icon v-if="role.show && roleSelected === role">
              mdi-chevron-up
            </v-icon>
            <v-icon v-else>mdi-chevron-down</v-icon>
          </v-container>
          <div v-if="role.show && roleSelected === role">
            <permission-selector
              :permissions="role.groupedPermissions"
              :is-switch-disabled="!edit"
            />
            <div class="d-flex justify-end">
              <v-btn
                v-if="role.editable"
                class="font-weight-bold mt-5 ml-3"
                color="primary"
                @click="!edit ? (edit = true) : submitPermission()"
              >
                {{ edit ? 'Guardar' : 'Editar' }}
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import PermissionSelector from '@/components/modules/settings/PermissionSelector.vue'

export default {
  name: 'RolesAndPermissions',
  components: { PermissionSelector },
  mixins: [adminBffMixin],
  data() {
    return {
      roles: [],
      edit: false,
      roleSelected: {},
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  created() {
    this.getRoles()
  },
  methods: {
    async getRoles() {
      if (this.clientId) {
        const roles = await this.getRolesAndGroupedPermissionByClientId()
        this.roles = roles.map((role) => ({ ...role, show: false }))
      }
    },
    roleShow(role) {
      role.show = !role.show
      this.roleSelected = role
    },
    async submitPermission() {
      console.log(this.roleSelected.groupedPermissions)
      const permissionList = []
      Object.values(this.roleSelected.groupedPermissions).forEach(
        (permissionArray) => {
          permissionArray.forEach((permissionObject) => {
            permissionList.push({
              permissionId: permissionObject.id,
              isChecked: permissionObject.checked,
            })
          })
        }
      )
      const obj = { id: this.roleSelected.id, permissions: permissionList }
      await this.postPermissionByRole(obj)
      this.edit = false
      this.$store.commit('alert', {
        color: 'info',
        text: 'Se ha guardado con éxito los cambios!',
      })
      // await this.putPermissionByRole(
      //   this.roleSelected.id,
      //   rolePermissionList
      // ).then(() => {
      //   this.edit = false
      //   this.$store.commit('alert', {
      //     color: 'info',
      //     text: 'Se ha guardado con éxito los cambios!',
      //   })
      // })
    },
  },
}
</script>
