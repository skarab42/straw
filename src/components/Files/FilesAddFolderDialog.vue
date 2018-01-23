<template>
  <page-dialog :open="open" @close="close">
    <page-card>
      <page-card-toolbar :color="color" :icon="icon" :title="title">
        <v-spacer />
        <v-btn icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
      </page-card-toolbar>
      <v-card-text>
        <v-text-field autofocus label="Folder name" placeholder="my_new_folder" :rules="[validate]" v-model="name" @keyup.13="confirm" />
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="!valid" :color="color" flat @click="confirm">confirm</v-btn>
        <v-spacer />
        <v-btn color="grey" flat @click="close">close</v-btn>
      </v-card-actions>
    </page-card>
  </page-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { validateFileName } from '@/store/modules/files'

export default {
  name: 'files-add-folder-dialog',

  props: {
    open: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      color: 'success',
      icon: 'create_new_folder',
      title: 'Add new folder',
      valid: false,
      name: ''
    }
  },

  computed: {
    ...mapGetters('boards', ['selectedBoardAddress']),
    ...mapGetters('files', ['currentBoardPath', 'currentBoardFolderList'])
  },

  methods: {
    ...mapActions('files', ['makeFolder']),

    clear () {
      this.name = ''
    },

    validate (name) {
      this.valid = false

      if (!name.length) {
        return 'Can not be empty.'
      }

      let invalidChars = validateFileName(name)

      if (invalidChars) {
        return 'Invalid char' + (invalidChars.length > 1 ? 's' : '') +
        ' [ ' + invalidChars.join(', ') + ' ].'
      }

      if (this.currentBoardFolderList.some(f => f.name === name)) {
        return 'Folder name must be unique.'
      }

      this.valid = true

      return true
    },

    close () {
      this.$emit('close')
      this.clear()
    },

    confirm () {
      this.makeFolder({ name: this.name })
      this.close()
    }
  }
}
</script>
