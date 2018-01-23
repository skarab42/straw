<template>
  <page-card>
    <files-list-toolbar :icon="icon" :title="title">
      <v-btn icon @click="dialogs.addFolder = true">
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
          <v-list-tile-action>
            <v-icon v-if="folder.invalidChars">warning</v-icon>
            <v-btn v-if="!folder.invalidChars" icon @click.stop>
              <v-icon color="grey lighten-1">more_vert</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </files-list-loading>
    </v-card-text>

    <files-add-folder-dialog :open="dialogs.addFolder" @close="dialogs.addFolder = false" />
  </page-card>
</template>

<script>
import FilesListToolbar from './FilesListToolbar'
import FilesListBreadcrumbs from './FilesListBreadcrumbs'
import FilesListLoading from './FilesListLoading'
import FilesIcon from './FilesIcon'
import FilesInfo from './FilesInfo'
import FilesAddFolderDialog from './FilesAddFolderDialog'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'files-folder-list',

  components: {
    FilesListToolbar,
    FilesListBreadcrumbs,
    FilesListLoading,
    FilesIcon,
    FilesInfo,
    FilesAddFolderDialog
  },

  data () {
    return {
      icon: 'folder',
      title: 'Folders',
      tempFolder: null,
      dialogs: {
        addFolder: false
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
    }
  }
}
</script>
