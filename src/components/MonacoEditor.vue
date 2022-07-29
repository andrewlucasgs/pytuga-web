<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import { useResizeObserver, useDebounceFn } from "@vueuse/core";
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import pytugaLanguageSettings from "../utils/pytugaLanguageSettings";

import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import { getInitialScript } from "../utils/getInitialScript";

self.MonacoEnvironment = {
  getWorker(workerId, label) {
    return new EditorWorker();
  },
};

const container = ref(null);

let editor;

const emit = defineEmits(["change", "runCode"]);
onMounted(() => {
  pytugaLanguageSettings();

  editor = monaco.editor.create(container.value, {
    value: getInitialScript(),
    language: "pytuga",
    theme: "pytugaTheme",
    fontWeight: "bold",
  });
  emit("change", editor.getValue());

  editor.onDidChangeModelContent(
    useDebounceFn(() => {
      emit("change", editor.getValue());
    }, 500)
  );

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function () {
    emit("change", editor.getValue());
    emit("runCode");
  });
});

function setValue(value) {
  editor.setValue(value);
  emit("change", editor.getValue());
}

const editorObserver = useResizeObserver(container, () => {
  editor.layout();
});

onUnmounted(() => {
  editor?.dispose();
  editorObserver.stop();
});
</script>

<template>
  <div ref="container" class="h-full"></div>
</template>
