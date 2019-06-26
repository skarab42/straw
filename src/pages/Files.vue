<i18n>
  {
    "en-us": {
      "title": "Files explorer",
      "folders": "Folders",
      "files": "Files",
      "refresh": "Refresh"
    },
    "fr-fr": {
      "title": "Explorateur de fichiers",
      "folders": "Dossiers",
      "files": "Fichiers",
      "refresh": "Actualiser"
    }
  }
</i18n>

<template>
  <s-page requireBoard>
    <s-card>

      <q-card-section>
        <div class="text-h6">{{ $t("title") }}</div>
      </q-card-section>

      <div class="row items-center">
        <div class="col-grow" :style="borderClass">

          <q-card-section>
            <q-breadcrumbs>
              <q-btn unelevated color="primary" size="sm" icon="refresh" :label="$q.screen.xs ? '' : $t('refresh')" @click.stop="list(path, true)" />
              <q-breadcrumbs-el v-for="item in breadcrumbs" :key="item.name" :label="item.name" @click.stop="list(item.path)" style="cursor: pointer" />
            </q-breadcrumbs>
          </q-card-section>

        </div>

        <div class="col-12 lt-sm">
          <q-separator spaced />
        </div>

        <div class="col-auto">
          <q-card-section>
            <q-btn flat round text-color="grey-6" icon="create_new_folder" @click.stop="openCreateFolderDialog" />
            <q-btn flat round text-color="grey-6" icon="note_add" @click.stop="openCreateFileDialog" />
            <q-btn flat round text-color="green" icon="cloud_upload" @click.stop="openUploadDialog" />
          </q-card-section>
        </div>
      </div>

      <q-separator spaced />

      <div class="row">
        <div class="col-12 col-sm-4" :style="borderClass">
          <q-list padding>
            <q-item dense>
              <q-item-section>
                <q-item-label>{{ $t('folders') }} ({{ folders.length }})</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple v-for="folder in folders" :key="folder.path" @click.stop="list(folder.path)">
              <q-item-section avatar top>
                <q-avatar icon="folder" text-color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1">{{ folder.name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat dense round text-color="grey-6" size="12px" icon="more_vert" @click.stop="openFileOptionMenu(folder)" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="col-12 lt-sm">
          <q-separator spaced />
        </div>
        <div class="col-12 col-sm-8">
          <q-list padding>
            <q-item dense>
              <q-item-section>
                <q-item-label>{{ $t('files') }} ({{ files.length }})</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple v-for="file in files" :key="file.path">
              <q-item-section avatar top>
                <q-avatar icon="assignment" color="grey-6" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1">{{ file.name }}</q-item-label>
                <q-item-label caption>{{ fs(file.size) }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat dense round text-color="grey-6" size="12px" icon="more_vert" @click.stop="openFileOptionMenu(file)" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <q-dialog v-model="createFolderDialog">
        <create-folder :board="selectedBoard" :path="path" @done="closeCreateFolderDialog" />
      </q-dialog>

      <q-dialog v-model="createFileDialog">
        createFileDialog
      </q-dialog>

      <q-dialog v-model="uploadDialog">
        uploadDialog
      </q-dialog>

      <q-inner-loading :showing="loading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>

    </s-card>
  </s-page>
</template>

<script>
import Board from '../lib/smoothie-happy/Board'
import { notifyError } from '../lib/notify'
import SPage from 'components/SPage.vue'
import SCard from 'components/SCard.vue'
import CreateFolder from 'components/CreateFolder.vue'
import { mapGetters } from 'vuex'
import filesize from 'filesize'
const sortAlpha = (a, b) => {
  if (a.name < b.name) return -1
  if (a.name > b.name) return 1
  return 0
}
export default {
  name: 'Files',
  components: {
    's-page': SPage,
    's-card': SCard,
    'create-folder': CreateFolder
  },
  data () {
    return {
      path: '/sd',
      createFolderDialog: false,
      createFileDialog: false,
      uploadDialog: false
    }
  },
  mounted () {
    this.path = '/sd'
    if (!this.selectedBoard) return
    this.list(this.selectedBoard.path)
  },
  computed: {
    breadcrumbs: function () {
      let path = ''
      return this.path.slice(1).split('/').map(name => {
        path += `/${name}`
        return { name, path }
      })
    },
    ...mapGetters({
      selectedBoard: 'boards/selectedBoard'
    }),
    folders: function () {
      if (!this.selectedBoard) return []
      return this.selectedBoard.files.filter(file => {
        return file.type === 'folder' && file.parent === this.path
      }).sort(sortAlpha)
    },
    files: function () {
      if (!this.selectedBoard) return []
      return this.selectedBoard.files.filter(file => {
        return file.type === 'file' && file.parent === this.path
      }).sort(sortAlpha)
    },
    loading: function () {
      return this.selectedBoard && this.selectedBoard.loading
    },
    borderClass: function () {
      return this.$q.screen.xs ? '' : 'border-right: 1px solid rgba(0,0,0,0.12)'
    }
  },
  methods: {
    fs: filesize,
    list: function (path, refresh = false) {
      this.path = path
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
    },
    openFileOptionMenu: function (file) {
      console.log('openFileOptionMenu:', file)
    },
    openUploadDialog: function () {
      this.uploadDialog = true
    },
    closeUploadDialog: function () {
      this.uploadDialog = false
    },
    openCreateFileDialog: function () {
      this.createFileDialog = true
    },
    closeCreateFileDialog: function () {
      this.createFileDialog = false
    },
    openCreateFolderDialog: function () {
      this.createFolderDialog = true
    },
    closeCreateFolderDialog: function () {
      this.createFolderDialog = false
    }
  },
  watch: {
    'selectedBoard': function (newValue, oldValue) {
      if (!this.selectedBoard) return
      if (oldValue && newValue && newValue.address === oldValue.address) return
      this.list(this.selectedBoard.path)
    }
  }
}
</script>
