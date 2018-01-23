<template>
  <v-toolbar dark :color="color" :flat="true">
    <v-icon v-if="icon" v-text="icon" />
    <v-toolbar-title v-if="title" v-text="title" />
    <slot name="default" />
  </v-toolbar>
</template>

<script>
export default {
  name: 'page-card-toolbar',

  props: {
    icon: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: 'primary'
    }
  }
}
</script>
