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
    <div class="mt-6 caption">Selecciona botones o lista para opciones.</div>
    <v-radio-group
      v-model="autoresponderItem.autoresponsesSetting.menuSetting.type"
      row
      hide-details
      class="mt-4"
    >
      <v-radio label="Botones" value="buttons"></v-radio>
      <v-radio label="Lista" value="list"></v-radio>
    </v-radio-group>
    <div
      v-if="
        autoresponderItem.autoresponsesSetting.menuSetting.type === 'buttons'
      "
    >
      <div class="d-flex flex-column align-start mt-4">
        <div
          v-for="btnItem in autoresponderItem.autoresponsesSetting.menuSetting
            .buttonList"
          :key="btnItem.id"
        >
          <see-button
            :btn-item="btnItem"
            @change-name="changeName"
            @delete-item-btn="deleteItemBtn"
          />
        </div>
      </div>
      <v-btn text color="primary" class="pl-0 mt-6" @click="createBtn()">
        <v-icon left>mdi-plus-circle-outline</v-icon>
        crear otro boton
      </v-btn>
      <div class="caption gray300--text">Puedes crear hasta 3 botones.</div>
    </div>
    <div
      v-if="autoresponderItem.autoresponsesSetting.menuSetting.type === 'list'"
      class="mt-6"
    >
      <div
        v-for="(buttom, index) in autoresponderItem.autoresponsesSetting
          .menuSetting.listList"
        :key="buttom.id"
        class="d-flex mt-2"
      >
        <see-list
          :btn-item="buttom"
          :index="index"
          @change-selected-list="changeListName"
          @delete-item-list="deleteItemList"
        />
      </div>
      <v-btn text color="primary" class="pl-0 mt-4 ml-1" @click="createList()">
        <v-icon left>mdi-plus-circle-outline</v-icon>
        crear otro boton
      </v-btn>
    </div>
    <change-name-dialog
      v-if="changeNameItem"
      v-model="activeChangeName"
      :name="changeNameItem"
      :tipo="tipo"
      @new-name="newName"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { VEmojiPicker } from 'v-emoji-picker'
import customTableBffMixin from '@/mixins/services/autoresponses/autoresponsesBffMixin'
import SeeList from '@/components/modules/autoresponses/SeeList.vue'
import SeeButton from '@/components/modules/autoresponses/SeeButton.vue'
import ChangeNameDialog from '@/components/modules/autoresponses/ChangeNameDialog.vue'

export default {
  menu: 'AutoresponderMenuSetting',
  components: { VEmojiPicker, SeeList, SeeButton, ChangeNameDialog },
  mixins: [customTableBffMixin],
  props: {
    autoresponderItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      variableList: null,
      activeEditItem: null,
      selectedBtn: {},
      selectedList: {},
      idNameChange: null,
      activeChangeName: false,
      changeNameItem: null,
      tipo: 'btn',
      typeList: [
        { text: 'Texto', value: 'text' },
        { text: 'Imagen', value: 'image' },
        { text: 'Link', value: 'link' },
        { text: 'Documento', value: 'document' },
      ],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  mounted() {
    this.getVariableList()
  },
  methods: {
    changeName(selectItem) {
      this.changeNameItem = JSON.parse(JSON.stringify(selectItem))
      this.idNameChange = selectItem
      this.tipo = 'btn'
      this.activeChangeName = true
    },
    changeListName(selectItem) {
      this.changeNameItem = JSON.parse(JSON.stringify(selectItem))
      this.idNameChange = selectItem
      this.tipo = 'list'
      this.activeChangeName = true
    },
    newName(newItem) {
      this.idNameChange.name = newItem.name
      this.activeChangeName = false
    },
    async getVariableList() {
      this.variableList = await this.getVariableListByClientId(this.clientId)
    },
    enterVariable(item) {
      this.autoresponderItem.autoresponsesSetting.messageText += item
      this.$emit('change-element')
    },
    selectEmoji(emoji) {
      this.autoresponderItem.autoresponsesSetting.messageText += emoji.data
      this.$emit('change-element')
    },
    deleteItemBtn(btnItem) {
      const list = JSON.parse(
        JSON.stringify(
          this.autoresponderItem.autoresponsesSetting.menuSetting.buttonList
        )
      )
      const listNew = list.filter((items) => items.id !== btnItem.id)
      this.autoresponderItem.autoresponsesSetting.menuSetting.buttonList =
        listNew
      this.$emit('change-element')
    },
    deleteItemList(listItem) {
      const list = JSON.parse(
        JSON.stringify(
          this.autoresponderItem.autoresponsesSetting.menuSetting.listList
        )
      )
      const listNew = list.filter((items) => items.id !== listItem.id)
      this.autoresponderItem.autoresponsesSetting.menuSetting.listList = listNew
      this.$emit('change-element')
    },
    createItemNo(type) {
      let seeList = []
      if (type === 'list') {
        seeList =
          this.autoresponderItem.autoresponsesSetting.menuSetting.listList
      } else {
        seeList =
          this.autoresponderItem.autoresponsesSetting.menuSetting.buttonList
      }
      let active = true
      let exists = -1
      const value = { id: seeList.length }
      while (active) {
        value.id += 1
        exists = seeList.findIndex((e) => e.id === value.id)
        if (exists === -1) {
          active = false
        }
      }
      return value.id
    },
    createBtn() {
      const contBtn = this.createItemNo('button')
      if (contBtn < 4) {
        const newItem = {
          id: contBtn,
          name: `Opción ${contBtn}`,
        }
        this.autoresponderItem.autoresponsesSetting.menuSetting.buttonList.push(
          newItem
        )
        this.$emit('change-element')
      }
    },
    createList() {
      const contList = this.createItemNo('list')
      const newItem = {
        id: contList,
        name: `Opción ${contList}`,
      }
      this.autoresponderItem.autoresponsesSetting.menuSetting.listList.push(
        newItem
      )
      this.$emit('change-element')
    },
  },
}
</script>
<style scoped>
.first-list {
  width: 50px !important;
  justify-content: center !important;
  background-color: var(--v-gray-base);
}
.chip-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  font-size: 14px;
  height: 42px;
  border: 1px solid var(--v-gray300-base);
  padding: 0 10px;
  width: 200px;
}

::v-deep .v-input__slot {
  box-shadow: none !important;
}
</style>
