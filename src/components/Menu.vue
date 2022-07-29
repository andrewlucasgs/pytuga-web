<script setup>
import { ref, defineAsyncComponent } from "vue";
import pako from "pako";
import { Base64 } from "js-base64";

const LearnModal = defineAsyncComponent(() => import("./LearnModal.vue"));
const AboutModal = defineAsyncComponent(() => import("./AboutModal.vue"));

const props = defineProps(["code", "codeIsRunning"]);

const downloadCode = () => {
  const blob = new Blob([props.code], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "code.py";
  link.click();
};

const shareCode = async () => {
  const sharedCode = props.code.replace(/\r\n|\r|\n/g, "\r\n");
  const url = new URL(window.location.href);
  url.hash = "";
  url.searchParams.delete("from"); 
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
  await navigator.clipboard.writeText(url.href);
};

const isLearnOpen = ref(false);
const isAboutOpen = ref(false);

</script>
<template>
  <div class="h-screen w-16 bg-[#44475a]">
    <LearnModal :isOpen="isLearnOpen" @close="isLearnOpen = false" />
    <AboutModal  :isOpen="isAboutOpen" @close="isAboutOpen = false" />
    <div class="h-full">
      <div
        class="text-gray-400 bg-[#f8f8f2] p-2 border-[#44475a] border-4 rounded-full"
      >
        <img src="../assets/logo.png" class="h-auto w-full" />
      </div>
      <button
        @click="$emit('runCode')"
        class="text-gray-400 hover:border-l-[#bd93f9] border-l-transparent border-l-4 hover:text-[#f8f8f2] hover:bg-[#282a36] p-2 rounded-sm"
        title="Executar (Ctrl+Enter)"
      >
        <svg
          v-if="!codeIsRunning"
          xmlns="http://www.w3.org/2000/svg"
          class="h-auto w-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="animate-spin transform rotate-180 h-auto w-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
      <button
        @click="shareCode"
        class="text-gray-400 hover:border-l-[#bd93f9] border-l-transparent border-l-4 hover:text-white hover:bg-[#282a36] p-2 rounded-sm"
        title="Compartilhar código"
      >
        <svg
          class="h-auto w-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      </button>
      <button
        @click="downloadCode"
        class="text-gray-400 hover:border-l-[#bd93f9] border-l-transparent border-l-4 hover:text-white hover:bg-[#282a36] p-2 rounded-sm"
        title="Baixar código"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-auto w-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
          />
        </svg>
      </button>
      <button
        @click="isLearnOpen = true"
        class="text-gray-400 hover:border-l-[#bd93f9] border-l-transparent border-l-4 hover:text-white hover:bg-[#282a36] p-2 rounded-sm"
        title="Aprenda"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-auto w-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1"
        >
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
          />
        </svg>
      </button>

      <button
        @click="isAboutOpen = true"
        class="text-gray-400 hover:border-l-[#bd93f9] border-l-transparent border-l-4 hover:text-white hover:bg-[#282a36] p-2 rounded-sm"
        title="Ajuda"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-auto w-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
