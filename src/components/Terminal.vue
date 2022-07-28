<script setup>
const props = defineProps({
  output: {
    type: Array,
    default: [],
  },
});
</script>

<template>
  <div class="h-full w-full bg-[#282a36] overflow-auto text-white p-2">
    <pre>>>> {{ props.output.join("\n") }}</pre>
  </div>
</template>

<style lang="scss" scoped></style>
