<i18n>
  {
    "en-us": {
      "title": "Files explorer"
    },
    "fr-fr": {
      "title": "Explorateur de fichiers"
    }
  }
</i18n>

<template>
  <s-page requireBoard>
    <s-card>
      <q-card-section>
        <div class="text-h6">{{ $t("title") }}</div>
      </q-card-section>
      <files-header />
      <q-separator spaced />
      <div class="row">
        <div class="col-12 col-sm-4" :style="borderClass">
          <file-list type="folders" />
        </div>
        <div class="col-12 lt-sm">
          <q-separator spaced />
        </div>
        <div class="col-12 col-sm-8">
          <file-list type="files" />
        </div>
      </div>
      <q-inner-loading :showing="loading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </s-card>
  </s-page>
</template>

<script>
import { mapGetters } from 'vuex'
import SPage from 'components/SPage.vue'
import SCard from 'components/SCard.vue'
import FilesHeader from 'components/FilesHeader.vue'
import FilesList from 'components/FilesList.vue'
export default {
  name: 'Files',
  components: {
    's-page': SPage,
    's-card': SCard,
    'files-header': FilesHeader,
    'file-list': FilesList
  },
  data () {
    return { }
  },
  computed: {
    ...mapGetters({
      selectedBoard: 'boards/selectedBoard'
    }),
    loading () {
      return this.selectedBoard && this.selectedBoard.loading
    },
    borderClass () {
      return this.$q.screen.xs ? '' : 'border-right: 1px solid rgba(0,0,0,0.12)'
    }
  }
}
</script>
