<i18n>
  {
    "en-us": {
      "folders": "Folders",
      "files": "Files"
    },
    "fr-fr": {
      "folders": "Dossiers",
      "files": "Fichiers"
    }
  }
</i18n>

<template>
  <q-list padding>
    <q-item dense>
      <q-item-section>
        <q-item-label>{{ $t(type) }} ({{ files.length }})</q-item-label>
      </q-item-section>
    </q-item>
    <s-slide-item left-color="#027be3" v-for="file in files" :key="file.path" @left="e => onLeft(file, e)" @right="e => onRight(file, e)">
      <template v-if="file.type === 'file'" v-slot:left>
        <q-icon name="play_arrow" /> play
      </template>
      <template v-slot:right>
        <q-icon name="delete_forever" /> remove
      </template>
      <q-item clickable v-ripple @click="onClick(file)">
        <q-item-section avatar top>
          <q-avatar :icon="file.type === 'file' ? 'assignment' : 'folder'" color="grey-6" text-color="white" />
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1">{{ file.name }}</q-item-label>
          <q-item-label v-if="file.type === 'file'" caption>{{ fileSize(file.size) }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn flat dense round text-color="grey-6" size="12px" icon="more_vert" @click.stop>
            <q-menu auto-close anchor="bottom right" self="top right">
              <q-list style="min-width: 100px">
                <q-item v-if="file.type === 'file'" clickable @click="playFileDialog = true">
                  <q-item-section avatar>
                    <q-icon name="play_arrow" color="primary" />
                  </q-item-section>
                  <q-item-section>play</q-item-section>
                </q-item>
                <q-item clickable @click="renameFileDialog = true">
                  <q-item-section avatar>
                    <q-icon name="create" color="grey-8" />
                  </q-item-section>
                  <q-item-section>rename</q-item-section>
                </q-item>
                <q-item clickable @click="removeFileDialog = true">
                  <q-item-section avatar>
                    <q-icon name="delete_forever" color="red" />
                  </q-item-section>
                  <q-item-section>remove</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-item-section>
      </q-item>
    </s-slide-item>
  </q-list>
</template>

<script>
import SSlideItem from './SSlideItem'
import { mapGetters } from 'vuex'
import filesize from 'filesize'
export default {
  name: 'FilesList',
  props: ['type'],
  components: {
    's-slide-item': SSlideItem
  },
  data () {
    return {
      playFileDialog: false,
      renameFileDialog: false,
      removeFileDialog: false
    }
  },
  methods: {
    fileSize: filesize,
    onLeft (file, { reset }) {
      console.log('onLeft:', file)
      reset()
    },
    onRight (file, { reset }) {
      console.log('onRight:', file)
      reset()
    },
    onClick (file) {
      if (file.type === 'folder') {
        this.$store.commit('boards/update', {
          address: this.selectedBoard.address,
          path: file.path
        })
      }
    }
  },
  computed: {
    ...mapGetters({
      selectedBoard: 'boards/selectedBoard'
    }),
    files: function () {
      if (!this.selectedBoard) return []
      return this.selectedBoard.files.filter(file => {
        return file.type === this.type.slice(0, -1) && file.parent === this.selectedBoard.path
      })
    }
  }
}
</script>
