<i18n>
{
  "en-us": {
    "requireBoard": {
      "title": "Oups !",
      "message": "Please add and select a board before continuing here."
    }
  },
  "fr-fr": {
    "requireBoard": {
      "title": "Oups !",
      "message": "Merci d'ajouter puis sélectionner une carte avant de poursuivre par ici."
    }
  }
}
</i18n>

<template>
  <q-page class="s-page" :padding="!isMobile">
    <div class="row justify-center" :class="rowClass">
      <slot v-if="requireBoard && !selectedBoard" name="boardRequired">
        <s-card>
          <q-card-section>
            <div class="text-h6">{{ $t("requireBoard.title") }}</div>
            <p><router-link to="/boards">{{ $t("requireBoard.message") }}</router-link></p>
          </q-card-section>
        </s-card>
      </slot>
      <slot v-if="!requireBoard || (requireBoard && selectedBoard)"></slot>
    </div>
  </q-page>
</template>

<script>
import SCard from 'components/SCard.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'SPage',
  props: {
    requireBoard: Boolean
  },
  components: {
    's-card': SCard
  },
  computed: {
    isMobile: function () {
      return this.$q.screen.xs
    },
    rowClass: function () {
      return this.$q.screen.xs ? '' : 'q-gutter-md'
    },
    ...mapGetters({
      selectedBoard: 'boards/selectedBoard'
    })
  }
}
</script>
