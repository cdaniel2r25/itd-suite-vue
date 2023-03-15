<template>
  <div>
    <v-card outlined>
      <v-card-title v-if="roleName">
        <v-row>
          <v-col class="pl-6">
            <h3>{{ roleName }}</h3>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            v-for="(permissionList, applicationName, index) in permissions"
            :key="index"
            cols="12"
            sm="6"
            md="6"
          >
            <v-card-title> {{ applicationName }}</v-card-title>
            <v-switch
              v-for="permission in permissionList"
              :key="permission.id"
              v-model="permission.checked"
              class="permission"
              :label="`${permission.name}`"
              :input-value="permission.checked"
              :disabled="isSwitchDisabled"
            >
            </v-switch>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'PermissionSelector',
  props: {
    permissions: {
      type: Object,
      default: () => ({}),
    },
    roleName: {
      type: String,
      default: () => null,
    },
    isSwitchDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
}
</script>
<style scoped>
.permission {
  margin-top: 0%;
  margin-right: 15vw;
}
.permission >>> .v-input__slot {
  flex-direction: row-reverse;
  justify-content: flex-end;
  margin-left: 1em;
  margin-right: 0;
}
</style>
