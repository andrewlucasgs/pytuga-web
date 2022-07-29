<script setup>
import { onMounted, ref, watch } from "vue";
import pythonSetup from "../setup.py?raw";
import MonacoEditor from "./MonacoEditor.vue";
import Menu from "./Menu.vue";
import Terminal from "./Terminal.vue";
import Screen from "./Screen.vue";
import pako from "pako";
import { Base64 } from "js-base64";
import { useMagicKeys } from "@vueuse/core";
import HelpModal from "./HelpModal.vue";
import Split from "split.js";

async function setup_pyodide() {
  let setup_code = pythonSetup;
  return await window.pyodide.runPythonAsync(setup_code);
}

const output = ref([]);
const code = ref("mostre('Hello World')");
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
      stdout: appendOutput,
      stderr: appendOutput,
    });
    await pyodide.loadPackage("micropip");
    await setup_pyodide();
  }
  console.log("setup done");
  codeIsRunning.value = false;
});

const runPython = async () => {
  if (codeIsRunning.value) {
    console.log("wait");
    setTimeout(() => {
      runPython();
    }, 100);
    return;
  }
  codeIsRunning.value = true;

  output.value = [];
  const run_code = await window.pyodide.globals.get("run_code");
  await run_code(code.value);
  codeIsRunning.value = false;
};

const keys = useMagicKeys();
const CtrlEnter = keys["Ctrl+Enter"];

watch(CtrlEnter, (v) => {
  if (v) runPython();
});

const appendOutput = (text) => {
  output.value = [...output.value, text];
};
window.customDispatchEvent = (eventName, data) => {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
};

const editorInit = (editor) => {
  console.log(editor.session);
};

const onChange = (value) => {
  console.log(value);
  code.value = value;
};

const downloadCode = () => {
  const blob = new Blob([code.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "code.py";
  link.click();
};

const shareCode = () => {
  const sharedCode = code.value.replace(/\r\n|\r|\n/g, "\r\n");
  const url = new URL(window.location.href);
  url.hash = "";
  url.searchParams.delete("from"); // take care of collapsing params
  let script;
  try {
    script = Base64.fromUint8Array(pako.deflate(sharedCode), true);
  } catch {
    // fallback
    script = encodeURIComponent(sharedCode)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
  }
  url.searchParams.set("script", script);
  console.log(url.href);
  return url.href;
};
</script>

<template>
  <div class="h-screen w-screen flex">
    <Menu
      :codeIsRunning="codeIsRunning"
      @runCode="runPython"
      @download="downloadCode"
      @share="shareCode"
    />
    <div class="bg-[#282a36] w-full flex p-5 gap-1 overflow-hidden">
      <div
        id="split-h1"
        class="bg-green-600 rounded-lg border-2 border-[#f8f8f2] overflow-hidden w-1/2"
      >
        <MonacoEditor @runCode="runPython" @change="onChange" />
      </div>
      <div id="split-h2" class="flex flex-col w-1/2 gap-1 overflow-hidden">
        <div
          id="split-v1"
          class="bg-blue-600 rounded-lg border-2 border-[#f8f8f2] overflow-hidden h-1/2"
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
