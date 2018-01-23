<template>
  <v-container
    fluid
    :grid-list-xl="!fullscreen"
    :class="{ 'pa-0' : fullscreen }"
  >
    <slot name="default" />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'page-container',

  computed: {
    ...mapGetters('app', ['fullscreen'])
  }
}
</script>
