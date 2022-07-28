<template>
  <div ref="container" class="h-full"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, toRefs } from "vue";
import { useResizeObserver, useStorage, useDebounceFn } from "@vueuse/core";
import * as monaco from "monaco-editor";
import pytugaLanguageSettings from "../utils/pytugaLanguageSettings";
import pako from "pako";
import { Base64 } from "js-base64";

const container = ref(null);

let editor;

const emit = defineEmits(["change", 'runCode']);
onMounted(() => {
  pytugaLanguageSettings();
  let value;
  const url = new URL(window.location.href);
  const script_key = "script";

  if (url.searchParams.has(script_key)) {
    let script = url.searchParams.get(script_key);
    try {
      script = pako.inflate(Base64.toUint8Array(script), { to: "string" });
    } catch {
      script = "";
    }
    value = script;
  } else if (
    window.localStorage != null &&
    window.localStorage.getItem("codeBackup") !== null
  ) {
    value = window.localStorage.getItem("codeBackup");
  } else {
    value = "for i in range(10):\n    print(i)";
  }
  emit("change", value)

  editor = monaco.editor.create(container.value!, {
    value,
    language: "pytuga",
    theme: "pytugaTheme",
    fontWeight: "bold",
  });
  editor.onDidChangeModelContent(
    useDebounceFn(() => {
      emit("change", editor.getValue());
    }, 500)
  );
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function() {
    emit("change", editor.getValue());
    emit('runCode')
  });
});

function setValue(value) {
  editor.getModel().setValue(value);
}

const editorObserver = useResizeObserver(container, () => {
  editor.layout();
});
onUnmounted(() => {
  editor?.dispose();
  editorObserver.stop();
});
</script>
