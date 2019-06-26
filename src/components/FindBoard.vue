<i18n>
{
  "en-us": {
    "title": "Find board",
    "label": "Enter IP range",
    "allowedInputs": "Allowed inputs",
    "wildcard": "Wildcard",
    "singleIP": "Single IP",
    "addresses": "IP range",
    "hostname": "Hostname",
    "mixed": "Mixed",
    "addressesScanned": "Addresses scanned",
    "onPause": "On pause...",
    "boardsFound": "Smoothie found",
    "success": {
      "boardAdded": "Board \"{address}\" added to collection"
    },
    "errors": {
      "error": "Error : {message}"
    }
  },
  "fr-fr": {
    "title": "Trouver une carte",
    "label": "Entrez une plage d'IP",
    "allowedInputs": "Entrées autorisées",
    "wildcard": "Carte blanche",
    "singleIP": "IP seule",
    "addresses": "Plage d'IP",
    "hostname": "Nom d'hote",
    "mixed": "Combinaison",
    "addressesScanned": "Adresses scannées",
    "onPause": "En pause...",
    "boardsFound": "Smoothie trouvées",
    "success": {
      "boardAdded": "La carte \"{address}\" a étée ajoutée à la collection"
    },
    "errors": {
      "error": "Erreur : {message}"
    }
  }
}
</i18n>

<template>
  <s-card>
    <q-card-section>
      <div class="text-h6">{{ $t("title") }} <q-btn flat round dense color="grey-6" icon="help" size="md" @click.stop="openHelpDialog" /></div>
    </q-card-section>
    <q-card-section>
      <q-input outlined clearable v-model="addresses" @keyup.enter="start" :label="$t('label')" :disable="scanning">
        <template v-slot:after>
          <q-btn unelevated color="primary" size="lg" icon="search" @click.stop="start" :loading="scanning && !aborted" :disable="scanning" />
        </template>
      </q-input>
    </q-card-section>
    <q-card v-if="scanning">
      <q-linear-progress :value="percent / 100" color="pink" />
      <q-card-section class="row items-center no-wrap">
        <div>
          <div v-if="!aborted" class="text-weight-bold">{{ $t('addressesScanned') }} : {{ scanned }} / {{ total }} - {{ percent }}%</div>
          <div v-if="aborted" class="text-weight-bold">{{ $t('onPause') }}</div>
          <div class="text-grey">{{ $t('boardsFound') }} : {{ found }}</div>
        </div>
        <q-space />
        <q-btn v-if="!aborted" flat round icon="pause" @click.stop="pause" />
        <q-btn v-if="aborted" flat round icon="play_arrow" @click.stop="resume" />
        <q-btn flat round icon="stop" @click.stop="stop" />
      </q-card-section>
    </q-card>
    <q-dialog v-model="helpDialog" transition-show="flip-down" transition-hide="flip-up">
      <q-card class="bg-primary text-white">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ $t("allowedInputs") }}</div>
          <q-space />
          <q-btn icon="close" flat round dense @click.stop="closeHelpDialog" />
        </q-card-section>
        <q-card-section>
          <q-list bordered separator>
            <q-item>
              <q-item-section>{{ $t("wildcard") }}</q-item-section>
              <q-item-section>192.168.1.*</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>{{ $t("singleIP") }}</q-item-section>
              <q-item-section>192.168.1.100</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>{{ $t("addresses") }}</q-item-section>
              <q-item-section>192.168.1.100-120</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>{{ $t("hostname") }}</q-item-section>
              <q-item-section>my.smoothie.board</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>{{ $t("mixed") }}</q-item-section>
              <q-item-section>192.168.1.100-120, my.smoothie.board, ...</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </s-card>
</template>

<script>
import SCard from 'components/SCard.vue'
import { mapGetters } from 'vuex'
import NetworkScanner from '../lib/NetworkScanner'
import { notifyError, notifySuccess } from '../lib/notify'
const networkScanner = new NetworkScanner()
export default {
  name: 'FindBoard',
  components: {
    's-card': SCard
  },
  data () {
    return {
      helpDialog: false,
      addresses: '',
      timeout: 1000,
      scanning: false,
      aborted: false,
      found: 0,
      total: 0,
      scanned: 0,
      percent: 0
    }
  },
  computed: {
    ...mapGetters({
      getBoardByAddress: 'boards/getBoardByAddress'
    })
  },
  methods: {
    openHelpDialog: function (event) {
      this.helpDialog = true
    },
    closeHelpDialog: function (event) {
      this.helpDialog = false
    },
    start: function (event) {
      if (!this.addresses.length) {
        return
      }
      try {
        networkScanner.setInput(this.addresses)
        networkScanner.setTimeout(this.timeout)
        networkScanner.onProgress = progress => {
          this.found = progress.found
          this.total = progress.total
          this.scanned = progress.scanned
          this.percent = Math.round(progress.percent)
        }
        networkScanner.onBoard = board => {
          if (this.getBoardByAddress(board.state.address)) {
            return
          }
          board.state.timeout = 0
          this.$store.commit('boards/set', { ...board.state })
          notifySuccess(this.$t('success.boardAdded', { address: board.state.address }))
        }
        networkScanner.onDone = boards => {
          this.scanning = false
        }
        networkScanner.start()
        this.scanning = true
      } catch (e) {
        notifyError(this.$t('errors.error', { message: e.message }))
      }
    },
    pause: function (event) {
      networkScanner.pause()
      this.aborted = true
    },
    resume: function (event) {
      networkScanner.resume()
      this.aborted = false
    },
    stop: function (event) {
      networkScanner.stop()
      this.scanning = false
      this.aborted = false
    }
  }
}
</script>
