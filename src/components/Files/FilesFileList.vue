<template>
  <page-card>

    <files-list-toolbar :icon="icon" :title="title" />
    <files-list-breadcrumbs />

    <v-card-text>
      <files-list-loading>
        <p v-if="!currentBoardFileList.length" class="text-xs-center mb-0">Empty folder</p>
        <v-list-tile avatar v-for="file in currentBoardFileList" :key="file.name" @click>
          <v-list-tile-avatar icon>
            <files-icon :file="file" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ file.name }}</v-list-tile-title>
            <files-info :file="file" />
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon v-if="file.invalidChars">warning</v-icon>
            <v-menu v-if="!file.invalidChars" bottom left transition="scale-transition">
              <v-btn icon slot="activator">
                <v-icon color="grey">more_vert</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile v-for="action in actions" :key="action.title" @click="openDialog(action.dialog, file)">
                  <v-list-tile-action>
                    <v-icon>{{ action.icon }}</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-title>{{ action.title }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-list-tile-action>
        </v-list-tile>
      </files-list-loading>
    </v-card-text>

    <files-rename-dialog :file="tempFile" :open="dialogs.rename" @close="dialogs.rename = false" />
    <files-remove-dialog :file="tempFile" :open="dialogs.remove" @close="dialogs.remove = false" />

  </page-card>
</template>

<script>
import FilesListToolbar from './FilesListToolbar'
import FilesListBreadcrumbs from './FilesListBreadcrumbs'
import FilesListLoading from './FilesListLoading'
import FilesIcon from './FilesIcon'
import FilesInfo from './FilesInfo'
import FilesRenameDialog from './FilesRenameDialog'
import FilesRemoveDialog from './FilesRemoveDialog'
import { mapGetters } from 'vuex'

export default {
  name: 'files-file-list',

  components: {
    FilesListToolbar,
    FilesListBreadcrumbs,
    FilesListLoading,
    FilesIcon,
    FilesInfo,
    FilesRenameDialog,
    FilesRemoveDialog
  },

  data () {
    return {
      icon: 'insert_drive_file',
      title: 'Files',
      tempFile: null,
      actions: [
        { dialog: 'rename', title: 'Rename', icon: 'mode_edit' },
        { dialog: 'remove', title: 'Remove', icon: 'delete_forever' }
      ],
      dialogs: {
        rename: false,
        remove: false
      }
    }
  },

  computed: {
    ...mapGetters('files', ['currentBoardFileList'])
  },

  methods: {
    openDialog (name, file) {
      if (this.dialogs[name] !== undefined) {
        this.tempFile = file
        this.dialogs[name] = true
      }
    }
  }
}
</script>
