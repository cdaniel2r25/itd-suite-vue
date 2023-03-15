<template>
  <v-container fluid>
    <v-form v-model="isFormValid">
      <v-row class="pt-8">
        <v-col :cols="cols">
          <v-text-field
            v-model="connector.name"
            label="Nombre del conector"
            placeholder="Ingresar nombre"
            outlined
          />
        </v-col>
        <v-col :cols="cols">
          <v-select
            v-model="connector.modality"
            :items="modalityItems"
            label="Modalidad"
            placeholder="Ingresar nombre"
            outlined
          />
        </v-col>
      </v-row>
      <v-row class="flex-column" no-gutters>
        <v-switch v-model="connector.ssl" color="primary" flat label="SSL" />
        <v-radio-group
          v-model="connector.waitResponse"
          class="d-flex mb-n10"
          row
          dense
          hide-details
        >
          <v-col cols="2">Espera respuesta</v-col>
          <v-col class="d-flex flex-row" cols="2">
            <v-radio label="Sí" :value="true"></v-radio>
            <v-radio label="No" :value="false"></v-radio>
          </v-col>
        </v-radio-group>
        <v-radio-group
          v-model="connector.sslValidation"
          class="d-flex"
          row
          dense
          hide-details
        >
          <v-col cols="2">Validar SSL</v-col>
          <v-col class="d-flex flex-row" cols="2">
            <v-radio label="Sí" :value="true"></v-radio>
            <v-radio label="No" :value="false"></v-radio>
          </v-col>
        </v-radio-group>
      </v-row>
      <v-row dense class="align-center mt-5" no-gutters>
        <v-col cols="5">
          <div class="d-flex justify-space-between rounded gray100 pr-2">
            <v-col cols="3" class="pr-2">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="accent"
                    class="justify-space-between"
                    text
                    block
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ `${connector.requestMethod}` }}
                    <v-icon color="accent">mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <v-list color="gray100">
                  <v-list-item
                    v-for="(item, index) in apiRequestMethodsItems"
                    :key="index"
                    @click="selectRequestMethod(item)"
                  >
                    <v-list-item-title>{{ item }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-col cols="9">
              <v-text-field
                v-model="connector.url"
                placeholder="Ingresar la url"
                dense
                hide-details
              />
            </v-col>
          </div>
        </v-col>
        <v-col cols="3">
          <v-btn
            v-if="
              !apiLoadingStatus && connectorTestButton && !apiResponseStatus
            "
            class="ml-10"
            outlined
            :disabled="!isFormValid"
            @click="testConnector()"
          >
            probar conector
          </v-btn>
          <v-icon
            v-if="
              apiLoadingStatus && !apiResponseStatus && !connectorTestButton
            "
            class="ml-5"
            x-large
            color="primary"
          >
            mdi-spin mdi-loading
          </v-icon>
          <v-sheet
            v-if="
              !apiLoadingStatus && apiResponseStatus && !connectorTestButton
            "
            outlined
            rounded
            class="ml-10"
            :color="connectorStatus ? 'success' : 'error'"
          >
            <v-row
              class="white pa-2 rounded accent--text text-button font-weight-bold justify-center"
              dense
              no-gutters
            >
              <v-icon
                :class="!connectorStatus ? ' pr-0' : 'pr-5'"
                :color="connectorStatus ? 'success' : 'error'"
              >
                {{ connectorStatus ? 'mdi-check-circle' : 'mdi-close-circle' }}
              </v-icon>
              {{
                connectorStatus
                  ? 'conector habilitado'
                  : 'conector deshabilitado'
              }}
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
    </v-form>
    <v-row
      v-if="isConnectorSended && connector.id === null"
      class="mt-10"
      no-gutters
    >
      <v-sheet outlined rounded :color="isConnectorValid ? 'success' : 'error'">
        <v-card flat>
          <v-card-text
            class="d-flex justify-space-between accent--text text-subtitle-1"
          >
            <v-icon
              class="pr-10"
              :color="isConnectorValid ? 'success' : 'error'"
            >
              {{ isConnectorValid ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
            {{
              isConnectorValid
                ? 'Se ha creado con éxito el conector'
                : 'No se ha creado el conector'
            }}
            <v-spacer />
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-row>
    <v-tabs v-model="tab" class="mt-15" color="primary">
      <v-tab v-for="tabHeader in tabs" :key="tabHeader">
        {{ tabHeader }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <div>
          <v-data-table
            :headers="datableHeaders"
            :items="paramsList"
            item-key="key"
            :items-per-page="5"
            :footer-props="{
              itemsPerPageText: 'Filas',
            }"
            class="rounded-sm striped-table"
          >
            <template v-slot:top>
              <div class="d-flex justify-end">
                <v-btn
                  rounded
                  color="primary"
                  @click="addParametersDialog = true"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </template>
            <template v-slot:no-data>
              <v-card-text>
                <v-col>
                  <span class="text-h7 gray300--text">
                    No existen rutas registradas para este conector. Si deseas
                    agregar una ruta pincha
                  </span>

                  <v-btn
                    text
                    color="primary"
                    @click="addParametersDialog = true"
                  >
                    aquí
                  </v-btn>
                </v-col>
              </v-card-text>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn dark icon @click="activeEditPath(item, 'params')">
                <v-icon medium color="primary" class="mr-2">
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="deleteDialogActivator = true"
                  >
                    <v-icon medium color="primary" class="mr-2">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </template>

                <v-dialog
                  v-model="deleteDialogActivator"
                  persistent
                  max-width="30%"
                >
                  <v-card>
                    <div class="d-flex justify-end mb-n8">
                      <v-btn
                        class="ml-15"
                        color="grey"
                        plain
                        @click="deleteDialogActivator = false"
                      >
                        <v-icon color="grey">mdi-close</v-icon>
                      </v-btn>
                    </div>
                    <div class="pa-10">
                      <v-card-title
                        class="text-h5 lighten-2 d-flex justify-space-between mt-n4"
                      >
                        <v-spacer />
                        <v-icon x-large color="warning" class="pb-5">
                          mdi-alert-circle
                        </v-icon>
                        <v-spacer />
                      </v-card-title>
                      <v-card-text align="center">
                        Va a eliminar el parámetro
                        <span class="accent--text font-weight-bold">
                          {{ item.key }}
                        </span>
                      </v-card-text>
                    </div>
                    <v-card-actions class="justify-center pb-10">
                      <v-btn
                        large
                        outlined
                        color="primary"
                        @click="deleteDialogActivator = false"
                      >
                        CANCELAR
                      </v-btn>
                      <v-btn
                        large
                        color="primary"
                        depressed
                        class="ml-5"
                        @click="deletePath(item)"
                      >
                        ELIMINAR
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-menu>
            </template>
          </v-data-table>
        </div>
      </v-tab-item>
      <v-tab-item>
        <div class="d-flex my-5">
          <v-col cols="4">
            <v-col cols="12" class="accent--text"> Tipo: </v-col>
            <v-col cols="12">
              <v-select
                v-model="connector.selectedAuth"
                label="Autenticación"
                :items="authItems"
                outlined
                @change="cleanAuth()"
              />
            </v-col>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col cols="8">
            <div
              v-if="connector.selectedAuth === 'Basic Auth'"
              class="d-flex align-start flex-column ml-5"
            >
              <v-col cols="6">
                <v-text-field
                  v-model="connector.auth.user"
                  label="Usuario"
                  placeholder="Ingresar"
                  outlined
                />
                <v-text-field
                  v-model="connector.auth.password"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  label="Contraseña"
                  placeholder="Ingresar"
                  :type="showPassword ? 'text' : 'password'"
                  outlined
                  @click:append="showPassword = !showPassword"
                />
              </v-col>
            </div>
          </v-col>
        </div>
      </v-tab-item>
      <v-tab-item>
        <div>
          <v-data-table
            :headers="datableHeaders"
            :items="apiHeaderList"
            item-key="key"
            :items-per-page="5"
            :footer-props="{
              itemsPerPageText: 'Filas',
            }"
            class="rounded-sm striped-table"
          >
            <template v-slot:top>
              <div class="d-flex justify-end">
                <v-btn rounded color="primary" @click="addHeadersDialog = true">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </template>
            <template v-slot:no-data>
              <v-card-text>
                <v-col>
                  <span class="text-h7 gray300--text">
                    No existen headers registrados para este conector. Si deseas
                    agregar un header pincha
                  </span>

                  <v-btn text color="primary" @click="addHeadersDialog = true">
                    aquí
                  </v-btn>
                </v-col>
              </v-card-text>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn dark icon @click="activeEditPath(item, 'headers')">
                <v-icon medium color="primary" class="mr-2">
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="deleteHeaderDialogActivator = true"
                  >
                    <v-icon medium color="primary" class="mr-2">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </template>

                <v-dialog
                  v-model="deleteHeaderDialogActivator"
                  persistent
                  max-width="30%"
                >
                  <v-card>
                    <div class="d-flex justify-end mb-n8">
                      <v-btn
                        class="ml-15"
                        color="grey"
                        plain
                        @click="deleteHeaderDialogActivator = false"
                      >
                        <v-icon color="grey">mdi-close</v-icon>
                      </v-btn>
                    </div>
                    <div class="pa-10">
                      <v-card-title
                        class="text-h5 lighten-2 d-flex justify-space-between mt-n4"
                      >
                        <v-spacer />
                        <v-icon x-large color="warning" class="pb-5">
                          mdi-alert-circle
                        </v-icon>
                        <v-spacer />
                      </v-card-title>
                      <v-card-text align="center">
                        Va a eliminar el header
                        <span class="accent--text font-weight-bold">
                          {{ item.key }}
                        </span>
                      </v-card-text>
                    </div>
                    <v-card-actions class="justify-center pb-10">
                      <v-btn
                        large
                        outlined
                        color="primary"
                        @click="deleteHeaderDialogActivator = false"
                      >
                        CANCELAR
                      </v-btn>
                      <v-btn
                        large
                        color="primary"
                        depressed
                        class="ml-5"
                        @click="deleteHeader(item)"
                      >
                        ELIMINAR
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-menu>
            </template>
          </v-data-table>
        </div>
      </v-tab-item>
      <v-tab-item>
        <div>
          <v-row v-if="editJson" dense class="justify-end mr-5 mt-1">
            <v-btn
              class="mr-3"
              color="primary"
              outlined
              @click="editJson = false"
            >
              edición key:valor
            </v-btn>
            <v-btn color="primary" @click="stringToJson()">guardar</v-btn>
          </v-row>
          <v-row v-if="editJson" dense>
            <v-textarea
              v-if="editJson"
              v-model="stringJsonAux"
              filled
              class="my-5 mx-5"
              :placeholder="`Ingresar JSON { ''key'':''value'', ''key2'':''value2'', }...`"
              rows="4"
              full-width
              hide-details
            />
          </v-row>
          <v-data-table
            v-if="!editJson"
            :headers="bodyHeaders"
            :items="apiBodyList"
            item-key="key"
            :items-per-page="5"
            :footer-props="{
              itemsPerPageText: 'Filas',
            }"
            class="rounded-sm striped-table"
          >
            <template v-slot:top>
              <div class="d-flex justify-end">
                <v-btn rounded color="primary" @click="addBodyDialog = true">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn
                  class="ml-5"
                  rounded
                  color="primary"
                  outlined
                  @click="editJson = true"
                >
                  <v-icon>mdi-pencil</v-icon> editar json
                </v-btn>
              </div>
            </template>
            <template v-slot:no-data>
              <v-card-text>
                <v-col>
                  <span class="text-h7 gray300--text">
                    No existen parámetros registrados para este conector. Si
                    deseas agregar un parámetro pincha
                  </span>

                  <v-btn text color="primary" @click="addBodyDialog = true">
                    aquí
                  </v-btn>
                </v-col>
              </v-card-text>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn dark icon @click="activeEditBody(item)">
                <v-icon medium color="primary" class="mr-2">
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="deleteBodyDialogActivator = true"
                  >
                    <v-icon medium color="primary" class="mr-2">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </template>

                <v-dialog
                  v-model="deleteBodyDialogActivator"
                  persistent
                  max-width="30%"
                >
                  <v-card>
                    <div class="d-flex justify-end mb-n8">
                      <v-btn
                        class="ml-15"
                        color="grey"
                        plain
                        @click="deleteBodyDialogActivator = false"
                      >
                        <v-icon color="grey">mdi-close</v-icon>
                      </v-btn>
                    </div>
                    <div class="pa-10">
                      <v-card-title
                        class="text-h5 lighten-2 d-flex justify-space-between mt-n4"
                      >
                        <v-spacer />
                        <v-icon x-large color="warning" class="pb-5">
                          mdi-alert-circle
                        </v-icon>
                        <v-spacer />
                      </v-card-title>
                      <v-card-text align="center">
                        Va a eliminar el parámetro
                        <span class="accent--text font-weight-bold">
                          {{ item.key }}
                        </span>
                      </v-card-text>
                    </div>
                    <v-card-actions class="justify-center pb-10">
                      <v-btn
                        large
                        outlined
                        color="primary"
                        @click="deleteBodyDialogActivator = false"
                      >
                        CANCELAR
                      </v-btn>
                      <v-btn
                        large
                        color="primary"
                        depressed
                        class="ml-5"
                        @click="deleteBodyParams(item)"
                      >
                        ELIMINAR
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-menu>
            </template>
          </v-data-table>
        </div>
      </v-tab-item>
    </v-tabs-items>
    <v-row no-gutters>
      <v-btn large outlined color="primary" @click="returnToMainView()">
        CANCELAR
      </v-btn>
      <v-btn
        large
        color="primary"
        depressed
        class="ml-5"
        :disabled="!isFormValid"
        @click="saveConnector()"
      >
        {{ connector.id === null ? 'CREAR CONECTOR' : 'GUARDAR' }}
      </v-btn>
    </v-row>
    <v-dialog v-model="addParametersDialog" persistent max-width="30%">
      <v-card>
        <div class="d-flex justify-end mb-n8">
          <v-btn
            class="ml-15"
            color="grey"
            plain
            @click="addParametersDialog = false"
          >
            <v-icon color="grey">mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="pa-10">
          <v-card-title
            class="text-h5 lighten-2 d-flex justify-space-between mt-n4"
          >
            <v-spacer />
            <div class="accent--text">Añadir Parámetros</div>
            <v-spacer />
          </v-card-title>
          <v-card-subtitle class="d-flex justify-center my-5 accent--text">
            Comprueba si la ruta está habilitada
          </v-card-subtitle>
          <v-card-text align="center">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPath.key"
                  label="Key"
                  placeholder="Key"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPath.value"
                  label="Valor"
                  placeholder="Valor"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPath.description"
                  label="Descripción"
                  placeholder="Ingrese una descripción"
                  outlined
                />
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions class="justify-center pb-10">
          <v-btn
            large
            outlined
            color="primary"
            @click="addParametersDialog = false"
          >
            CERRAR
          </v-btn>
          <v-btn
            large
            color="primary"
            depressed
            class="ml-5"
            @click="addPath(paramsList)"
          >
            AÑADIR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addHeadersDialog" persistent max-width="30%">
      <v-card>
        <div class="d-flex justify-end mb-n8">
          <v-btn
            class="ml-15"
            color="grey"
            plain
            @click="addHeadersDialog = false"
          >
            <v-icon color="grey">mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="pa-10">
          <v-card-title
            class="text-h5 lighten-2 d-flex justify-space-between mt-n4"
          >
            <v-spacer />
            <div class="accent--text">Añadir Header</div>
            <v-spacer />
          </v-card-title>
          <v-card-subtitle class="d-flex justify-center my-5 accent--text">
            Agrega encabezados a la llamada.
          </v-card-subtitle>
          <v-card-text align="center">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPath.key"
                  label="Key"
                  placeholder="Key"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPath.value"
                  label="Valor"
                  placeholder="Valor"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPath.description"
                  label="Descripción"
                  placeholder="Ingrese una descripción"
                  outlined
                />
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions class="justify-center pb-10">
          <v-btn
            large
            outlined
            color="primary"
            @click="addHeadersDialog = false"
          >
            CERRAR
          </v-btn>
          <v-btn
            large
            color="primary"
            depressed
            class="ml-5"
            @click="addPath(apiHeaderList)"
          >
            AÑADIR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addBodyDialog" persistent max-width="30%">
      <v-card>
        <div class="d-flex justify-end mb-n8">
          <v-btn
            class="ml-15"
            color="grey"
            plain
            @click="addBodyDialog = false"
          >
            <v-icon color="grey">mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="pa-10">
          <v-card-title
            class="text-h5 lighten-2 d-flex justify-space-between mt-n4"
          >
            <v-spacer />
            <div class="accent--text">Body</div>
            <v-spacer />
          </v-card-title>
          <v-card-subtitle class="d-flex justify-center my-5 accent--text">
            Añadir parámetros al cuerpo de la llamada.
          </v-card-subtitle>
          <v-card-text align="center">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedBody.key"
                  label="Key"
                  placeholder="Key"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="selectedBody.type"
                  :items="bodyTypeItems"
                  label="Valor"
                  placeholder="Valor"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedBody.description"
                  label="Descripción"
                  placeholder="Ingrese una descripción"
                  outlined
                />
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions class="justify-center pb-10">
          <v-btn large outlined color="primary" @click="addBodyDialog = false">
            CERRAR
          </v-btn>
          <v-btn
            large
            color="primary"
            depressed
            class="ml-5"
            @click="addBodyParams()"
          >
            AÑADIR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialogActivator" persistent max-width="30%">
      <v-card>
        <div class="d-flex justify-end mb-n8">
          <v-btn
            class="ml-15"
            color="grey"
            plain
            @click="editDialogActivator = false"
          >
            <v-icon color="grey">mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="pa-10">
          <v-card-title
            class="text-h5 lighten-2 d-flex justify-space-between mt-n4"
          >
            <v-spacer />
            <div class="accent--text">Editar</div>
            <v-spacer />
          </v-card-title>
          <v-card-subtitle class="d-flex justify-center my-5 accent--text">
            Modifica los valores que necesitas.
          </v-card-subtitle>
          <v-card-text align="center">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPathAux.key"
                  label="Key"
                  placeholder="Key"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPathAux.value"
                  label="Valor"
                  placeholder="Valor"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPathAux.description"
                  label="Descripción"
                  placeholder="Ingrese una descripción"
                  outlined
                />
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions class="justify-center pb-10">
          <v-btn
            large
            outlined
            color="primary"
            @click="editDialogActivator = false"
          >
            CANCELAR
          </v-btn>
          <v-btn
            large
            color="primary"
            depressed
            class="ml-5"
            @click="editPath('params')"
          >
            GUARDAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialogHeadersActivator" persistent max-width="30%">
      <v-card>
        <div class="d-flex justify-end mb-n8">
          <v-btn
            class="ml-15"
            color="grey"
            plain
            @click="editDialogHeadersActivator = false"
          >
            <v-icon color="grey">mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="pa-10">
          <v-card-title
            class="text-h5 lighten-2 d-flex justify-space-between mt-n4"
          >
            <v-spacer />
            <div class="accent--text">Editar</div>
            <v-spacer />
          </v-card-title>
          <v-card-subtitle class="d-flex justify-center my-5 accent--text">
            Modifica los valores que necesitas.
          </v-card-subtitle>
          <v-card-text align="center">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPathAux.key"
                  label="Key"
                  placeholder="Key"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPathAux.value"
                  label="Valor"
                  placeholder="Valor"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPathAux.description"
                  label="Descripción"
                  placeholder="Ingrese una descripción"
                  outlined
                />
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions class="justify-center pb-10">
          <v-btn
            large
            outlined
            color="primary"
            @click="editDialogHeadersActivator = false"
          >
            CANCELAR
          </v-btn>
          <v-btn
            large
            color="primary"
            depressed
            class="ml-5"
            @click="editPath('headers')"
          >
            GUARDAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialogBodyActivator" persistent max-width="30%">
      <v-card>
        <div class="d-flex justify-end mb-n8">
          <v-btn
            class="ml-15"
            color="grey"
            plain
            @click="editDialogBodyActivator = false"
          >
            <v-icon color="grey">mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="pa-10">
          <v-card-title
            class="text-h5 lighten-2 d-flex justify-space-between mt-n4"
          >
            <v-spacer />
            <div class="accent--text">Editar Body</div>
            <v-spacer />
          </v-card-title>
          <v-card-subtitle class="d-flex justify-center my-5 accent--text">
            Modifica los valores que necesitas.
          </v-card-subtitle>
          <v-card-text align="center">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedBodyAux.key"
                  label="Key"
                  placeholder="Key"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="selectedBodyAux.type"
                  :items="bodyTypeItems"
                  label="Valor"
                  placeholder="Valor"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedBodyAux.description"
                  label="Descripción"
                  placeholder="Ingrese una descripción"
                  outlined
                />
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions class="justify-center pb-10">
          <v-btn
            large
            outlined
            color="primary"
            @click="editDialogBodyActivator = false"
          >
            CANCELAR
          </v-btn>
          <v-btn
            large
            color="primary"
            depressed
            class="ml-5"
            @click="editBody()"
          >
            GUARDAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'
import connectorsMixin from '@/mixins/services/connectorsMixin'

export default {
  name: 'ApiConnector',
  components: {},
  mixins: [validationMixin, connectorsMixin],
  props: {
    connector: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      cols: 4,
      tab: null,
      tabs: ['parámetros', 'autorización', 'headers', 'body'],
      addParametersDialog: false,
      addHeadersDialog: false,
      addBodyDialog: false,
      dialogActivator: false,
      editDialogActivator: false,
      editDialogHeadersActivator: false,
      editDialogBodyActivator: false,
      deleteDialogActivator: false,
      deleteHeaderDialogActivator: false,
      deleteBodyDialogActivator: false,
      isFormValid: false,
      connectorStatus: false,
      connectorTestButton: true,
      apiLoadingStatus: false,
      apiResponseStatus: false,
      isConnectorValid: false,
      isConnectorSended: false,
      isPathDeleted: false,
      showPassword: false,
      editJson: false,
      stringJsonAux: null,
      bodyItemAux: {
        id: null,
        key: null,
        type: null,
        description: null,
      },
      bodyTypeItems: [
        'STRING',
        'INT',
        'BOOLEAN',
        'OBJECT',
        'ARRAY',
        'LIST',
        'NUMBER',
        'DATE',
        'DATETIME',
      ],
      modalityItems: ['Entrada', 'Salida'],
      apiRequestMethodsItems: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      selectedPath: {
        id: null,
        key: null,
        value: null,
        description: null,
      },
      selectedBody: {
        id: null,
        key: null,
        type: null,
        description: null,
      },
      selectedPathAux: {
        id: null,
        key: null,
        value: null,
        description: null,
      },
      selectedBodyAux: {
        id: null,
        key: null,
        type: null,
        description: null,
      },
      datableHeaders: [
        { text: 'Key', value: 'key' },
        { text: 'Valor', value: 'value' },
        { text: 'Descripción', value: 'description' },
        { text: '', value: 'actions', sortable: false },
      ],
      bodyHeaders: [
        { text: 'Key', value: 'key' },
        { text: 'Tipo de objeto', value: 'type' },
        { text: 'Descripción', value: 'description' },
        { text: '', value: 'actions', sortable: false },
      ],
      authItems: ['No Authentication', 'Basic Auth'],
      selectedPathIndex: 0,
      paramsList: [],
      apiHeaderList: [],
      apiBodyList: [],
    }
  },
  computed: {
    nameRules() {
      return [
        (v) => this.isRequired(v, 'Nombre de conector'),
        (v) => this.minLength(v, 4),
      ]
    },
    userRules() {
      return [(v) => this.isRequired(v, 'Usuario'), (v) => this.minLength(v, 4)]
    },
    passwordRules() {
      return [
        (v) => this.isRequired(v, 'Contraseña'),
        (v) => this.minLength(v, 1),
      ]
    },
    serverRules() {
      return [
        (v) => this.isRequired(v, 'Servidor'),
        (v) => this.minLength(v, 2),
      ]
    },
    portRules() {
      return [(v) => this.isRequired(v, 'Puerto'), (v) => this.minLength(v, 4)]
    },
  },
  created() {
    if (this.connector.id !== null && this.connector.id.length > 1) {
      this.isConnectorValid = true
      this.paramsList = JSON.parse(JSON.stringify(this.connector.params))
      this.apiHeaderList = JSON.parse(JSON.stringify(this.connector.headers))
      this.apiBodyList = JSON.parse(JSON.stringify(this.connector.body))
      this.paramsList = JSON.parse(JSON.stringify(this.connector.params))
    }
  },
  methods: {
    async testConnector() {
      this.connectorTestButton = false
      this.apiLoadingStatus = true
      if (this.connector.url !== '') {
        this.connectorStatus = await this.testApiConnector(this.connector)
        this.apiLoadingStatus = false
        this.apiResponseStatus = true
      }
    },
    getSelectedPathIndex(item) {
      this.selectedPathIndex = this.paramsList.indexOf(item)
    },
    async saveConnector() {
      const connectorToSend = JSON.parse(JSON.stringify(this.connector))
      connectorToSend.params = this.paramsList
      connectorToSend.headers = this.apiHeaderList
      connectorToSend.body = this.apiBodyList
      await this.saveApiConnector(connectorToSend)
      this.returnToMainView()
    },
    cleanSelectedPath() {
      this.selectedPath = {
        id: null,
        key: null,
        value: null,
        description: null,
      }
    },
    cleanSelectedBodyParams() {
      this.selectedBody = {
        id: null,
        key: null,
        type: null,
        description: null,
      }
    },
    cleanSelectedBodyAuxParams() {
      this.selectedBodyAux = {
        id: null,
        key: null,
        type: null,
        description: null,
      }
    },
    cleanSelectedPathAux() {
      this.selectedPath = {
        id: null,
        key: null,
        value: null,
        description: null,
      }
    },
    addPath(array) {
      array.push(this.selectedPath)
      this.cleanSelectedPath()
      this.addParametersDialog = false
      this.addHeadersDialog = false
    },
    addBodyParams() {
      this.apiBodyList.push(this.selectedBody)
      this.cleanSelectedBodyParams()
      this.addBodyDialog = false
    },
    activeEditPath(item, tabHeader) {
      if (tabHeader === 'params') {
        this.selectedPathIndex = this.paramsList.indexOf(item)
        this.selectedPathAux = { ...item }
        this.editDialogActivator = true
      }
      if (tabHeader === 'headers') {
        this.selectedPathIndex = this.apiHeaderList.indexOf(item)
        this.selectedPathAux = { ...item }
        this.editDialogHeadersActivator = true
      }
    },
    activeEditBody(item) {
      this.selectedBodyIndex = this.apiBodyList.indexOf(item)
      this.selectedBodyAux = { ...item }
      this.editDialogBodyActivator = true
    },
    editPath(tabHeader) {
      if (tabHeader === 'params') {
        Object.assign(
          this.paramsList[this.selectedPathIndex],
          this.selectedPathAux
        )
        this.editDialogActivator = false
      }
      if (tabHeader === 'headers') {
        Object.assign(
          this.apiHeaderList[this.selectedPathIndex],
          this.selectedPathAux
        )
        this.editDialogHeadersActivator = false
      }
      this.cleanSelectedPathAux()
    },
    editBody() {
      Object.assign(
        this.apiBodyList[this.selectedBodyIndex],
        this.selectedBodyAux
      )
      this.editDialogBodyActivator = false

      this.cleanSelectedBodyAuxParams()
    },
    async deletePath(path) {
      this.deleteDialogActivator = false
      if (path.id === null) {
        this.removeElementFromArray(this.paramsList, path)
      } else {
        this.isPathDeleted = await this.deleteApiParameterById(path.id)
        if (this.isPathDeleted)
          this.removeElementFromArray(this.paramsList, path)
      }
    },
    async deleteHeader(header) {
      this.deleteHeaderDialogActivator = false
      if (header.id === null) {
        this.removeElementFromArray(this.apiHeaderList, header)
      } else {
        this.isHeaderDeleted = await this.deleteApiHeaderById(header.id)
        if (this.isHeaderDeleted)
          this.removeElementFromArray(this.apiHeaderList, header)
      }
    },
    async deleteBodyParams(param) {
      this.deleteHeaderDialogActivator = false
      if (param.id === null) {
        this.removeElementFromArray(this.apiBodyList, param)
      } else {
        this.isBodyDeleted = await this.deleteApiBodyParameterById(param.id)
        if (this.isBodyDeleted)
          this.removeElementFromArray(this.apiBodyList, param)
      }
    },
    removeElementFromArray(array, item) {
      const index = array.indexOf(item)
      if (index > -1) {
        array.splice(index, 1)
      }
    },
    returnToMainView() {
      this.$router.push({ name: 'Connectors' })
    },
    selectRequestMethod(item) {
      this.connector.requestMethod = item
    },
    cleanAuth() {
      if (this.connector.selectedAuth !== 'Basic Auth') {
        this.connector.auth.user = ''
        this.connector.auth.password = ''
      }
    },
    stringToJson() {
      const parsedJson = JSON.parse(this.stringJsonAux)
      const keyValuePairs = Object.entries(parsedJson)
      this.apiBodyList = []
      keyValuePairs.forEach(([key, value]) => {
        const bodyItemAux2 = {
          id: null,
          key: null,
          type: null,
          description: null,
        }
        const typeofAux = typeof value
        bodyItemAux2.key = key
        bodyItemAux2.type = typeofAux.toUpperCase()
        bodyItemAux2.description = 'No desc...'
        this.apiBodyList.push(bodyItemAux2)
        this.selectedBodyAux = {
          id: null,
          key: null,
          type: null,
          description: null,
        }
      })
      this.editJson = false
    },
  },
}
</script>
