<template>
  <v-dialog v-model="dialogModel" :lazy="lazy" :fullscreen="fullscreen" max-width="768" @input="input">
    <slot name="default" />
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'page-dialog',

  props: {
    open: {
      type: Boolean,
      default: false
    },

    lazy: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    ...mapGetters('app', ['fullscreen']),

    dialogModel: {
      get () {
        return this.open
      },

      set (open) {
        this.$emit(open ? 'open' : 'close')
      }
    },

    input () {
      this.$emit(this.open ? 'open' : 'close')
    }
  }
}
</script>
