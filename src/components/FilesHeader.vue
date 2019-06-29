<i18n>
  {
    "en-us": {
      "refresh": "Refresh"
    },
    "fr-fr": {
      "refresh": "Actualiser"
    }
  }
</i18n>

<template>
  <div class="row items-center">
    <div class="col-grow" :style="borderClass">
      <q-card-section>
        <q-breadcrumbs>
          <q-btn unelevated color="primary" size="sm" icon="refresh" :label="breadcrumbsLabel" @click.stop="listPath(null, true)" />
          <q-breadcrumbs-el v-for="item in breadcrumbsItems" :key="item.name" :label="item.name" @click.stop="listPath(item.path)" style="cursor: pointer" />
        </q-breadcrumbs>
      </q-card-section>
    </div>
    <div class="col-12 lt-sm">
      <q-separator spaced />
    </div>
    <div class="col-auto">
      <q-card-section>
        <q-btn flat round text-color="grey-6" icon="create_new_folder" @click.stop="createFolderDialog = true" />
        <q-btn flat round text-color="grey-6" icon="note_add" @click.stop="createFileDialog = true" />
        <q-btn flat round text-color="green" icon="cloud_upload" @click.stop="uploadDialog = true" />
      </q-card-section>
    </div>
    <q-dialog v-model="createFolderDialog">
      <create-folder :board="selectedBoard" :path="path" @done="createFolderDialog = false" />
    </q-dialog>
    <q-dialog v-model="createFileDialog">
      createFileDialog
    </q-dialog>
    <q-dialog v-model="uploadDialog">
      uploadDialog
    </q-dialog>
  </div>
</template>

<script>
import CreateFolder from 'components/CreateFolder.vue'
import Board from '../lib/smoothie-happy/Board'
import { notifyError } from '../lib/notify'
import { mapGetters } from 'vuex'
export default {
  name: 'FilesHeader',
  components: {
    'create-folder': CreateFolder
  },
  data () {
    return {
      createFolderDialog: false,
      createFileDialog: false,
      uploadDialog: false
    }
  },
  mounted () {
    this.listPath()
  },
  computed: {
    ...mapGetters({
      selectedBoard: 'boards/selectedBoard'
    }),
    path () {
      return this.selectedBoard ? this.selectedBoard.path : '/sd'
    },
    borderClass () {
      return this.$q.screen.xs ? '' : 'border-right: 1px solid rgba(0,0,0,0.12)'
    },
    breadcrumbsLabel () {
      return this.$q.screen.xs ? '' : this.$t('refresh')
    },
    breadcrumbsItems () {
      let path = ''
      return this.path.slice(1).split('/').map(name => {
        path += `/${name}`
        return { name, path }
      })
    },
    folders: function () {
      if (!this.selectedBoard) return []
      return this.selectedBoard.files.filter(file => {
        return file.type === 'folder' && file.parent === this.path
      })
    },
    files: function () {
      if (!this.selectedBoard) return []
      return this.selectedBoard.files.filter(file => {
        return file.type === 'file' && file.parent === this.path
      })
    }
  },
  watch: {
    selectedBoard (newValue, oldValue) {
      if (
        oldValue && newValue &&
        (newValue.address === oldValue.address) &&
        (newValue.path === oldValue.path)
      ) return
      this.listPath()
    }
  },
  methods: {
    setPath (path) {
      this.$store.commit('boards/update', {
        address: this.selectedBoard.address,
        path
      })
    },
    listPath (path, refresh = false) {
      if (!this.selectedBoard) return
      if (path) {
        this.setPath(path)
      }
      if (!refresh && (this.files.length || this.folders.length)) {
        return
      }
      let board = new Board(this.selectedBoard.address, this.selectedBoard)
      this.$store.commit('boards/update', {
        address: board.state.address,
        loading: true
      })
      board.ls(this.path)
        .then(files => {
          this.$store.commit('boards/update', {
            address: board.state.address,
            files
          })
        })
        .catch(error => {
          notifyError(`${board.state.name} : ${error.message}`)
        })
        .then(() => {
          this.$store.commit('boards/update', {
            address: board.state.address,
            loading: false
          })
        })
    }
  }
}
</script>
