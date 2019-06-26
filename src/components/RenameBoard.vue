<i18n>
{
  "en-us": {
    "title": "Rename board",
    "description": "This is an alias name. You can not change the IP or hostname of the board.",
    "success": {
      "boardRenamed": "Board \"{address}\" renamed from \"{oldName}\" to \"{newName}\"."
    },
    "errors": {
      "uniqueName": "A board is already named \"{name}\"."
    },
    "cancel": "Cancel",
    "reset": "Reset",
    "rename": "Rename"
  },
  "fr-fr": {
    "title": "Renomer la carte",
    "description": "C'est un nom d'alias. Vous ne pouvez pas changer l'adresse IP ou le nom d'hôte de la carte.",
    "success": {
      "boardRenamed": "Carte \"{address}\" a été renommée de \"{oldName}\" en \"{newName}\"."
    },
    "errors": {
      "uniqueName": "Une carte se nomme déjà \"{name}\"."
    },
    "cancel": "Annuler",
    "reset": "Réinitialiser",
    "rename": "Renommer"
  }
}
</i18n>

<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ $t("title") }}</div>
      <p>{{ $t("description") }} ({{ board.address }})</p>
    </q-card-section>
    <q-card-section>
      <q-input dense v-model="name" autofocus @keyup.enter="rename" />
    </q-card-section>
    <q-card-actions align="right" class="text-primary">
      <q-btn flat :label="$t('cancel')" @click.stop="cancel" color="grey-6" />
      <q-btn flat :label="$t('reset')" @click.stop="reset" />
      <q-btn flat :label="$t('rename')" @click.stop="rename" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { notifySuccess, notifyError } from '../lib/notify'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'RenameBoard',
  props: ['board'],
  data () {
    return {
      name: this.board.name
    }
  },
  computed: {
    ...mapState({
      boards: 'boards'
    }),
    ...mapGetters({
      getBoardByName: 'boards/getBoardByName'
    })
  },
  methods: {
    cancel: function (event) {
      this.$emit('cancel')
      this.$emit('done')
    },
    reset: function (event) {
      this.name = this.board.address
    },
    rename: function (event) {
      if (!this.name.length) {
        return
      }
      if (this.board.name === this.name) {
        this.$emit('done')
        return
      }
      if (this.getBoardByName(this.name)) {
        notifyError(this.$t('errors.uniqueName', { name: this.name }))
        return
      }
      let oldName = this.board.name
      this.$store.commit('boards/update', {
        address: this.board.address,
        name: this.name
      })
      notifySuccess(this.$t('success.boardRenamed', {
        address: this.board.address,
        newName: this.name,
        oldName
      }))
      this.$emit('renamed')
      this.$emit('done')
    }
  }
}
</script>
