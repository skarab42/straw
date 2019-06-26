<template>
  <s-page>
    <select-board />
    <add-board />
    <find-board />
  </s-page>
</template>

<script>
import SPage from 'components/SPage.vue'
import SelectBoard from 'components/SelectBoard.vue'
import AddBoard from 'components/AddBoard.vue'
import FindBoard from 'components/FindBoard.vue'
export default {
  name: 'Boards',
  components: {
    's-page': SPage,
    'select-board': SelectBoard,
    'add-board': AddBoard,
    'find-board': FindBoard
  }
}
</script>
