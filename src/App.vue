<template>
  <simple-layout></simple-layout>
</template>

<script>
import SimpleLayout from "@/views/SimpleLayout.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { SimpleLayout },
});
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
}
</style>
