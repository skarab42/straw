<i18n>
{
  "en-us": {
    "title": "Add board",
    "label": "Enter board IP or hostname",
    "errors": {
      "boardExists": "Board \"{address}\" allready in collection",
      "boardOffline": "Board \"{address}\" offline : {message}"
    },
    "success": {
      "boardAdded": "Board \"{address}\" added to collection"
    }
  },
  "fr-fr": {
    "title": "Ajouter une carte",
    "label": "Entrez l'IP ou le nom d'hote de la carte",
    "errors": {
      "boardExists": "La carte \"{address}\" est déjà dans la collection",
      "boardOffline": "La carte \"{address}\" est hors ligne : {message}"
    },
    "success": {
      "boardAdded": "La carte \"{address}\" a étée ajoutée à la collection"
    }
  }
}
</i18n>

<template>
  <s-card>
    <q-card-section>
      <div class="text-h6">{{ $t("title") }}</div>
    </q-card-section>
    <q-card-section>
      <q-input outlined clearable v-model="address" @keyup.enter="add" :label="$t('label')" :disable="loading">
        <template v-slot:after>
          <q-btn unelevated color="primary" size="lg" icon="add" @click.stop="add" :loading="loading" :disable="loading" />
        </template>
      </q-input>
    </q-card-section>
  </s-card>
</template>

<script>
import { notifyError, notifySuccess } from '../lib/notify'
import Board from '../lib/smoothie-happy/Board'
import SCard from 'components/SCard.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'AddBoard',
  components: {
    's-card': SCard
  },
  data () {
    return {
      address: '',
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      getBoardByAddress: 'boards/getBoardByAddress'
    })
  },
  methods: {
    add: function (event) {
      // this.addFake('192.168.1.122')
      // this.addFake('192.168.1.123')
      // this.addFake('192.168.1.124')
      if (!this.address.length) {
        return
      }
      if (this.getBoardByAddress(this.address)) {
        notifyError(this.$t('errors.boardExists', { address: this.address }))
        return
      }
      this.loading = true
      let board = new Board(this.address)
      board.version()
        .then(version => {
          board.state.timeout = 0
          this.$store.commit('boards/set', { ...board.state })
          notifySuccess(this.$t('success.boardAdded', { address: this.address }))
          this.address = ''
        })
        .catch(error => {
          notifyError(this.$t('errors.boardOffline', {
            address: this.address,
            message: error.message
          }))
        })
        .then(() => {
          this.loading = false
        })
    }
    // addFake: function (address) {
    //   let board = new Board('192.168.1.121', { timeout: 2000 })
    //   board.version()
    //     .then(version => {
    //       this.$store.commit('boards/set', { ...board.state, address, name: address })
    //       notifySuccess(this.$t('success.boardAdded', { address }))
    //       this.address = ''
    //     })
    // }
  }
}
</script>
