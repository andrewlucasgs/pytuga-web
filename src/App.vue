<script setup>
import { onMounted, ref, Suspense } from "vue";
import pythonSetup from "./setup.py?raw";
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-monokai";
async function setup_pyodide() {
  let setup_code = pythonSetup;
  return await window.pyodide.runPythonAsync(setup_code);
}

const output = ref([]);
const code = ref("mostre('Hello World')");

onMounted(async () => {
  document.addEventListener("eval.display", (data) => {
    displayTurtle(data);
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
});

const runPython = async () => {
  output.value = [];
  const run_code = await window.pyodide.globals.get("run_code");
  run_code(code.value);
};

const appendOutput = (text) => {
  output.value = [...output.value, text];
};
window.customDispatchEvent = (eventName, data) => {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
};

const graphics = ref(null);

const displayTurtle = (data) => {
  graphics.value.textContent = "";
  console.log("asdasdsad", data);
  window.setTimeout(function () {
    console.log(data.detail.content.outerHTML);
    graphics.value.innerHTML = data.detail.content.outerHTML;
  }, 1);
};
</script>

<template>
  <div>
    <header>
      <button @click="runPython">RUN</button>
    </header>
  </div>
  <div>
    <Suspense>
      <template #default>
        <main>
          <section class="editor">
            <VAceEditor
              v-model:value="code"
              lang="html"
              theme="monokai"
              style="height: 300px; width: 100%"
            />
          </section>

          <section>
            <pre>{{ output.join("\n") }}</pre>
          </section>
          <section>
            <div width="640" height="480" ref="graphics"></div>
          </section>
        </main>
      </template>
      <template #loading>
        <div>Loading...</div>
      </template>
    </Suspense>
  </div>
</template>

<style></style>
