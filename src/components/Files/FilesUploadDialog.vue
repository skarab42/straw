<template>
  <page-dialog :open="uploadDialog" @close="closeUploadDialog">
    <page-card>
      <page-card-toolbar :icon="icon" :title="title" :color="color">
        <v-spacer />
        <v-btn icon @click="closeUploadDialog">
          <v-icon>close</v-icon>
        </v-btn>
      </page-card-toolbar>
      <v-card-text>
        <p>All files will be uploaded to <strong>/{{ currentBoardPath }}/</strong></p>
        <div class="dropbox">
          <form enctype="multipart/form-data" novalidate>
            <input type="file" multiple name="files" :value="files" @change="onFilesChange" />
            <p>Drag your file(s) here to begin<br /> or click to browse</p>
          </form>
        </div>
        <v-alert v-if="currentBoardUploadStopped" outline color="info" icon="info" :value="true">
          Stopping... Please, wait until the current download is complete.
        </v-alert>
        <v-list two-line>
          <v-list-tile avatar v-for="upload in currentBoardUploadQueue" :key="upload.key" @click.stop>
            <v-list-tile-avatar icon>
              <files-icon v-if="!upload.uploading" :file="upload" />
              <v-progress-circular v-else :indeterminate="!upload.progress.percent" :value="upload.progress.percent" :size="40" color="primary">
                {{ upload.progress.percent }}
              </v-progress-circular>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <span v-if="!fullscreen" class="grey--text">{{ upload.path }}/</span>{{ upload.file.name }}
              </v-list-tile-title>
              <files-info :file="upload" />
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn v-if="!upload.uploading" icon @click="removeUpload(upload)">
                <v-icon class="grey--text">delete_forever</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="currentBoardUploadableQueue.length && !currentBoardUploading && !currentBoardUploadStopped" :color="color" flat @click="startUpload">start upload</v-btn>
        <v-btn v-if="currentBoardUploading && !currentBoardUploadStopped" color="error" flat @click="stopUpload">stop upload</v-btn>
        <v-btn v-if="currentBoardUploadStopped" flat :disabled="true">Stopping...</v-btn>
        <v-spacer />
        <v-btn color="grey" flat @click="closeUploadDialog">close</v-btn>
      </v-card-actions>
    </page-card>
  </page-dialog>
</template>

<script>
import FilesIcon from './FilesIcon'
import FilesInfo from './FilesInfo'
import { mapGetters, mapActions } from 'vuex'
import bus from '@/bus'

export default {
  name: 'files-upload-dialog',

  components: {
    FilesIcon,
    FilesInfo
  },

  created () {
    bus.$on('boards.addBoard', board => this.addBoard(board))
    bus.$on('boards.removeBoard', board => this.removeBoard(board))
    this.boardsCollection.forEach(board => this.addBoard(board))
  },

  props: {
    open: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      icon: 'file_upload',
      title: 'File upload',
      color: 'info',
      files: ''
    }
  },

  computed: {
    ...mapGetters('app', ['fullscreen']),
    ...mapGetters('files', ['currentBoardPath']),
    ...mapGetters('boards', ['boardsCollection']),
    ...mapGetters('upload', [
      'uploadDialog',
      'currentBoardUploading',
      'currentBoardUploadStopped',
      'currentBoardUploadQueue',
      'currentBoardUploadableQueue'
    ])
  },

  methods: {
    ...mapActions('upload', [
      'closeUploadDialog',
      'addUploadFiles',
      'addBoard',
      'removeBoard',
      'removeUpload',
      'startUpload',
      'stopUpload'
    ]),

    onFilesChange (e) {
      this.addUploadFiles([...e.target.files])
      e.target.value = ''
    }
  }
}
</script>

<style scoped lang="styl">
height = 100px

.dropbox {
  background: #eee;
}

.dropbox:hover {
  background: #fff;
}

.dropbox form {
  color: #555;
  width: 100%;
  overflow: hidden;
  min-height: height;
  position: relative;
  text-align: center;
  border: 2px #ccc dashed;
}

.dropbox input {
  top: 0;
  left: 0;
  opacity: 0;
  width: 100%;
  height: height;
  cursor: pointer;
  position: absolute;
}

.dropbox p {
  font-size: 1.2em;
  padding-top: (height / 2) - 25;
  text-align: center;
}
</style>
