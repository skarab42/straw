<template>
  <q-card :flat="isMobile" class="s-card col-xs-12 col-md-10 col-lg-8 col-xl-6">
    <slot></slot>
  </q-card>
</template>

<script>
export default {
  name: 'SCard',
  computed: {
    isMobile: function () {
      return this.$q.screen.xs
    }
  }
}
</script>
