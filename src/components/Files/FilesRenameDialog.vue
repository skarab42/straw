<template>
  <page-dialog v-if="file" :open="open" @open="onOpen" @close="close">
    <page-card>
      <page-card-toolbar :color="color" :icon="icon" :title="title">
        <v-spacer />
        <v-btn icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
      </page-card-toolbar>
      <v-card-text>
        <v-text-field autofocus label="File name" :placeholder="file.name" :rules="[validate]" v-model="name" @keyup.13="confirm" />
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="!valid" :color="color" flat @click="confirm">confirm</v-btn>
        <v-btn color="warning" flat @click="reset">reset</v-btn>
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
  name: 'files-rename-dialog',

  props: {
    open: {
      type: Boolean,
      default: false
    },

    file: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      color: 'success',
      icon: 'mode_edit',
      valid: false,
      name: ''
    }
  },

  computed: {
    title () {
      return 'Rename : ' + this.$props.file.name
    }
  },

  methods: {
    ...mapGetters('files', ['currentBoardFileList']),
    ...mapActions('files', ['renameFile']),

    clear () {
      this.name = ''
    },

    reset () {
      this.name = this.$props.file.name
    },

    onOpen () {
      this.reset()
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

      let key = this.$props.file.key
      let files = this.currentBoardFileList()
      let notUnique = files.some(f => f.name === name && f.key !== key)

      if (notUnique) {
        return 'File name must be unique.'
      }

      this.valid = true

      return true
    },

    close () {
      this.$emit('close')
      this.clear()
    },

    confirm () {
      this.renameFile({ ...this.$props.file, newName: this.name })
      this.close()
    }
  }
}
</script>
