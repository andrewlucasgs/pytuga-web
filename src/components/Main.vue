<script setup>
import { onMounted, ref, watch, defineAsyncComponent } from "vue";
import pythonSetup from "../setup.py?raw";

import { useMagicKeys } from "@vueuse/core";
import Split from "split.js";
import { tugalinhaTranslations } from "../utils/pytugaTokens";

const MonacoEditor = defineAsyncComponent(() => import("./MonacoEditor.vue"));

const Menu = defineAsyncComponent(() => import("./Menu.vue"));

const Terminal = defineAsyncComponent(() => import("./Terminal.vue"));

const Screen = defineAsyncComponent(() => import("./Screen.vue"));
async function setup_pyodide() {
  let setup_code = pythonSetup;
  return await window.pyodide.runPythonAsync(setup_code);
}

const output = ref([]);
const appendOutput = (text) => {
  output.value = [...output.value, text];
};

const code = ref(null);
const onChangeCode = (value) => {
  code.value = value;
};

const codeIsRunning = ref(true);
onMounted(async () => {
  Split(["#split-h1", "#split-h2"], {
    minSize: 10,
  });
  Split(["#split-v1", "#split-v2"], {
    direction: "vertical",
    minSize: 10,
  });

  if (!window.pyodide) {
    window.pyodide = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.20.0/full/",
      stdin: prompt,
      stdout: appendOutput,
      stderr: appendOutput,
    });
    // Pass base path to pyodide for loading packages
    window.pyodide.globals.set("VITE_BASE_PATH", import.meta.env.BASE_URL);

    await pyodide.loadPackage("micropip");
    await setup_pyodide();
  }
  codeIsRunning.value = false;
});

const runPython = async () => {
  if (codeIsRunning.value) {
    setTimeout(() => {
      runPython();
    }, 500);
    return;
  }
  codeIsRunning.value = true;

  output.value = [];
  await window.pyodide.globals.set(
    "tugalinhaTranslations",
    new Map(Object.entries(tugalinhaTranslations))
  );

  const run_code = await window.pyodide.globals.get("run_code");
  await run_code(code.value);
  codeIsRunning.value = false;
};

const keys = useMagicKeys();
const CtrlEnter = keys["Ctrl+Enter"];
watch(CtrlEnter, (v) => {
  if (v) runPython();
});


</script>

<template>
  <div class="h-screen w-screen flex">
    <Menu :code="code" :codeIsRunning="codeIsRunning" @runCode="runPython" />
    <div class="bg-[#282a36] w-full flex p-5 gap-1 overflow-hidden">
      <div
        id="split-h1"
        class="bg-[#282a36] rounded-lg border-2 border-[#f8f8f2] overflow-hidden w-1/2"
      >
        <MonacoEditor @runCode="runPython" @change="onChangeCode" />
      </div>
      <div id="split-h2" class="flex flex-col w-1/2 gap-1 overflow-hidden">
        <div
          id="split-v1"
          class="bg-[#282a36] rounded-lg border-2 border-[#f8f8f2] overflow-hidden h-1/2"
        >
          <Terminal :output="output" />
        </div>
        <div
          id="split-v2"
          class="bg-[#f8f8f2] rounded-lg border-2 border-[#f8f8f2] h-1/2 overflow-auto"
        >
          <Screen />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.gutter {
  @apply dark:bg-gray-900 bg-no-repeat;
  background-position: 50%;
}
.gutter.gutter-horizontal {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==");
  cursor: col-resize;
}
.gutter.gutter-vertical {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAYAAABSIVz6AAAABHNCSVQICAgIfAhkiAAAADFJREFUKM9jPHPmzH8GBgYGY2NjRgYGBoazZ8/Shc/EMECA8f///wNiMQu9gnbQBDUAzBRB0VN0sQwAAAAASUVORK5CYII=");
  cursor: row-resize;
}
</style>
