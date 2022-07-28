<template>
  <div>
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" @close="emit('close')" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div
            class="flex min-h-full items-center justify-center p-4 text-center"
          >
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900"
                >
                  Pytuga Web
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Trabalho de Conclusão de Curso pela Universidade de Brasília.
                  </p>
                   <p class="text-sm text-gray-500">
                    Desenvolvido por Andrew Lucas Guedes de Souza
                  </p>
                 
                </div>

                <div class="mt-4">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-[#282a36] px-4 py-2 text-sm font-medium text-white hover:bg-[#282a36c2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[# bd93f9] focus-visible:ring-offset-2"
                    @click="emit('close')"
                  >
                    Fechar
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

const emit = defineEmits(["close"]);


defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

</script>

<style lang="scss" scoped></style>
