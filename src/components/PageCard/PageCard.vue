<template>
  <v-card
    :dark="dark"
    :color="color"
    :flat="fullscreen || $props.flat"
    :class="{ 'square': fullscreen || $props.square }"
  >
  <slot name="default" />
</v-card>
</template>

<style scoped>
.square {
  border-radius: 0;
}
</style>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'page-card',

  props: {
    dark: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'withe'
    },
    flat: {
      type: Boolean,
      default: false
    },
    square: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters('app', ['fullscreen'])
  }
}
</script>
