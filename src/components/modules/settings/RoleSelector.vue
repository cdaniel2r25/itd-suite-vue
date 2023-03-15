<template>
  <div>
    <div class="my-5">
      <span>{{ description }}</span>
    </div>
    <v-radio-group v-model="userRole.role" row>
      <v-radio
        v-for="role in roles"
        :key="role.id"
        class="radio-button"
        :label="`${role.name}`"
        :value="role"
      />
    </v-radio-group>
    <v-col xl="8" md="8" sm="12">
      <permission-selector
        v-if="Object.keys(userRole.role).length > 0"
        :permissions="userRole.role.groupedPermissions"
        :role-name="userRole.role.name"
        is-switch-disabled
      />
    </v-col>
  </div>
</template>

<script>
import PermissionSelector from '@/components/modules/settings/PermissionSelector.vue'

export default {
  name: 'RoleSelector',
  components: { PermissionSelector },
  props: {
    userRole: {
      type: Object,
      default: () => {},
    },
    roles: {
      type: Array,
      default: () => [],
    },
    description: {
      type: String,
      default: 'Aquí podrás asignar un rol al Usuario.',
    },
  },
  data() {
    return {
      roleRadioGroup: null,
    }
  },
}
</script>
<style scoped>
.radio-button {
  padding-right: 6vw;
}
</style>
