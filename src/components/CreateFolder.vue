<i18n>
{
  "en-us": {
    "title": "Create folder",
    "label": "Folder name",
    "allowedChars": "Only alphanumerics and special characters \"-_.\", may be used within folder name.",
    "alphaNumFirst": "The folder name must begin with an alphanumeric character",
    "cancel": "Cancel",
    "create": "Create",
    "folderCreated": "Folder \"{path}\" created.",
    "folderCreateError": "Could not create folder \"{path}\"."
  },
  "fr-fr": {
    "title": "Créer un dossier",
    "label": "Nom du dossier",
    "allowedChars": "Seuls les caractères alphanumériques et les caractères spéciaux \"-_.\", peuvent être utilisés dans le nom du dossier.",
    "alphaNumFirst": "Le nom du dossier dois commencer par un caractère alphanumérique.",
    "cancel": "Annuler",
    "create": "Créer",
    "folderCreated": "Dossier \"{path}\" créer.",
    "folderCreateError": "Impossible de créer le dossier \"{path}\". ({message})"
  }
}
</i18n>

<template>
  <q-card style="min-width:300px">
    <q-card-section>
      <div class="text-h6">{{ $t("title") }}</div>
    </q-card-section>
    <q-card-section>
      <q-input
        bottom-slots
        autofocus
        ref="name"
        v-model="name"
        :label="$t('label')"
        :hint="$t('allowedChars')"
        :error="hasError"
        :error-message="errorMessage"
        @keyup.enter="create"
        @input="input"
      >
        <template v-slot:hint>{{ $t("allowedChars") }}</template>
      </q-input>
    </q-card-section>
    <q-card-actions align="right" class="text-primary">
      <q-btn flat :label="$t('cancel')" @click.stop="cancel" color="grey-6" />
      <q-btn flat :label="$t('create')" @click.stop="create" :disabled="!this.name.length || hasError" />
    </q-card-actions>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import { notifyError, notifySuccess } from '../lib/notify'
import Board from '../lib/smoothie-happy/Board'
export default {
  name: 'CreateFolder',
  props: ['board', 'path'],
  data () {
    return {
      name: '',
      loading: false,
      hasError: false,
      errorMessage: ''
    }
  },
  methods: {
    input: function (event) {
      if (!/^[a-z0-9]/i.test(this.name)) {
        this.errorMessage = this.$t('alphaNumFirst')
        this.hasError = true
      } else if (!/^[a-z0-9.\-_]+$/i.test(this.name)) {
        this.errorMessage = this.$t('allowedChars')
        this.hasError = true
      } else {
        this.hasError = false
      }
    },
    allowedChars: function (val) {
      return /^[a-z0-9.\-_]+$/i.test(val) || this.$t('allowedChars')
    },
    alphaNumFirst: function (val) {
      return /^[a-z0-9]/i.test(val) || this.$t('alphaNumFirst')
    },
    cancel: function (event) {
      this.$emit('cancel')
      this.$emit('done')
    },
    create: function (event) {
      if (this.hasError) return
      this.loading = true
      let board = new Board(this.board.address, this.board)
      let path = `${this.path}/${this.name}`.toLowerCase()
      board.mkdir(path)
        .then(folder => {
          this.$store.commit('boards/update', {
            address: board.state.address,
            files: board.state.files
          })
          notifySuccess(this.$t('folderCreated', { path }))
          this.$emit('done')
          this.name = ''
        })
        .catch(error => {
          notifyError(this.$t('folderCreateError', {
            path,
            address: this.address,
            message: error.message
          }))
        })
        .then(() => {
          this.loading = false
        })
    }
  }
}
</script>
