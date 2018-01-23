<template>
  <page-card>

    <files-list-toolbar :icon="icon" :title="title">
      <v-btn icon @click="dialogs.add = true">
        <v-icon>add</v-icon>
      </v-btn>
    </files-list-toolbar>
    <files-list-breadcrumbs />

    <v-card-text>
      <files-list-loading>
        <p v-if="!currentBoardFolderList.length" class="text-xs-center mb-0">No subfolder</p>
        <v-list-tile avatar v-for="folder in currentBoardFolderList" :key="folder.name" @click="openSubFolder(folder.name)">
          <v-list-tile-avatar icon>
            <files-icon :file="folder" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ folder.name }}</v-list-tile-title>
            <files-info :file="folder" />
          </v-list-tile-content>
          <v-list-tile-avatar @click.stop>
            <v-icon v-if="folder.invalidChars">warning</v-icon>
            <v-menu v-if="!folder.invalidChars" bottom left transition="scale-transition">
              <v-btn icon slot="activator">
                <v-icon color="grey">more_vert</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile v-for="action in actions" :key="action.title" @click="openDialog(action.dialog, folder)">
                  <v-list-tile-action>
                    <v-icon>{{ action.icon }}</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-title>{{ action.title }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-list-tile-avatar>
        </v-list-tile>
      </files-list-loading>
    </v-card-text>

    <files-add-folder-dialog :open="dialogs.add" @close="dialogs.add = false" />
    <files-rename-dialog :file="tempFolder" :open="dialogs.rename" @close="dialogs.rename = false" />
    <files-remove-dialog :file="tempFolder" :open="dialogs.remove" @close="dialogs.remove = false" />

  </page-card>
</template>

<script>
import FilesListToolbar from './FilesListToolbar'
import FilesListBreadcrumbs from './FilesListBreadcrumbs'
import FilesListLoading from './FilesListLoading'
import FilesIcon from './FilesIcon'
import FilesInfo from './FilesInfo'
import FilesAddFolderDialog from './FilesAddFolderDialog'
import FilesRenameDialog from './FilesRenameDialog'
import FilesRemoveDialog from './FilesRemoveDialog'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'files-folder-list',

  components: {
    FilesListToolbar,
    FilesListBreadcrumbs,
    FilesListLoading,
    FilesIcon,
    FilesInfo,
    FilesAddFolderDialog,
    FilesRenameDialog,
    FilesRemoveDialog
  },

  data () {
    return {
      icon: 'folder',
      title: 'Folders',
      tempFolder: null,
      actions: [
        { dialog: 'rename', title: 'Rename', icon: 'mode_edit' },
        { dialog: 'remove', title: 'Remove', icon: 'delete_forever' }
      ],
      dialogs: {
        add: false,
        rename: false,
        remove: false
      }
    }
  },

  computed: {
    ...mapGetters('files', ['currentBoardFolderList'])
  },

  methods: {
    ...mapActions('files', ['openFolder']),

    openSubFolder (subpath) {
      this.openFolder({ subpath })
    },

    openDialog (name, folder) {
      if (this.dialogs[name] !== undefined) {
        this.tempFolder = folder
        this.dialogs[name] = true
      }
    }
  }
}
</script>
