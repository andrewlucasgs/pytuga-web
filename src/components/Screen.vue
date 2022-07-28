<script setup>
import { onMounted, ref } from "vue";
import panzoom from "panzoom";
onMounted(() => {
  document.addEventListener("eval.display", (data) => {
    displayTurtle(data);
  });
});
const graphics = ref(null);
const panzoomInstance = ref(null);

const displayTurtle = (data) => {
  if (panzoomInstance.value) {
    panzoomInstance.value.dispose();
    panzoomInstance.value = null;
  }
  graphics.value.textContent = "";
  console.log(data.detail.content.outerHTML);
  graphics.value.innerHTML = data.detail.content.outerHTML.replace(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"',
    '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"'
  );
  const scene = document.querySelector("#group_scene");
  panzoomInstance.value = panzoom(scene);
};
</script>
<template>
  <div
    class="h-full max-w-full border-2 rounded-lg svg-container"
    ref="graphics"
  ></div>
</template>

<style scoped>
.svg-container > svg {
  width: 100%;
  height: 100%;
}
</style>
