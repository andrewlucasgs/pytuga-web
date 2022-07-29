<script setup>
import { onMounted, ref } from "vue";
import panzoom from "panzoom";
onMounted(() => {
  // can't create an custom event within pyodide, so we use a global variable
  window.customDispatchEvent = (eventName, data) => {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  };

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
  // Fix svg size to match the container size
  graphics.value.innerHTML = data.detail.content.outerHTML.replace(
    'width="800" height="450"',
    'width="100%" height="100%"'
  );

  const scene = document.querySelector("#group_scene");
  panzoomInstance.value = panzoom(scene);
};
</script>
<template>
  <div
    class="h-full max-w-full border-2 rounded-lg svg-container cursor-move"
    ref="graphics"
  ></div>
</template>

<style scoped>
.svg-container > svg {
  width: 100%;
  height: 100%;
}
</style>
