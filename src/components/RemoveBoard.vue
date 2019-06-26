<i18n>
{
  "en-us": {
    "title": "Remove board \"{name}\" ?",
    "boardRemoved": "The card \"{name}\" has been removed.",
    "cancel": "Annuler",
    "remove": "Remove"
  },
  "fr-fr": {
    "title": "Supprimer la carte \"{name}\" ?",
    "boardRemoved": "La carte \"{name}\" a bien été supprimée.",
    "cancel": "Annuler",
    "remove": "Supprimer"
  }
}
</i18n>

<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ $t("title", { name: board.name }) }}</div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat :label="$t('cancel')" color="grey-6" @click.stop="cancel" />
      <q-btn flat :label="$t('remove')" color="primary" @click.stop="remove" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { notifySuccess } from '../lib/notify'
import { mapState } from 'vuex'
export default {
  name: 'RenameBoard',
  props: ['board'],
  computed: {
    ...mapState({
      boards: 'boards'
    })
  },
  methods: {
    cancel: function (event) {
      this.$emit('cancel')
      this.$emit('done')
    },
    remove: function (event) {
      notifySuccess(this.$t('boardRemoved', { name: this.board.name }))
      this.$store.commit('boards/remove', this.board)
      this.$emit('removed')
      this.$emit('done')
    }
  }
}
</script>
