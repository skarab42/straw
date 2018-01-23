<template>
  <board-select>
    <files-upload-dialog />
    <page-container>
      <v-layout row wrap>
        <v-flex md4 xs12>
          <files-folder-list />
        </v-flex>
        <v-flex md8 xs12>
          <files-file-list />
        </v-flex>
      </v-layout>
    </page-container>
  </board-select>
</template>

<script>
import FilesUploadDialog from './FilesUploadDialog'
import FilesFolderList from './FilesFolderList'
import FilesFileList from './FilesFileList'
import { mapGetters, mapActions } from 'vuex'
import bus from '@/bus'

export default {
  name: 'files-page',

  components: {
    FilesUploadDialog,
    FilesFolderList,
    FilesFileList
  },

  created () {
    bus.$on('boards.addBoard', board => this.addBoard(board))
    bus.$on('boards.removeBoard', board => this.removeBoard(board))
    this.boardsCollection.forEach(board => this.addBoard(board))
    this.refreshFileList()
  },

  computed: {
    ...mapGetters('boards', ['boardsCollection', 'selectedBoardAddress'])
  },

  methods: {
    ...mapActions('files', ['addBoard', 'removeBoard', 'openFolder']),

    refreshFileList () {
      if (this.selectedBoardAddress) {
        this.openFolder()
      }
    }
  },

  watch: {
    selectedBoardAddress () {
      this.refreshFileList()
    }
  }
}
</script>
