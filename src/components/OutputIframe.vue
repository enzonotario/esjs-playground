<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { PlayIcon } from '@heroicons/vue/24/solid'
import { useEditor } from '@/composables/useEditor'

const editor = useEditor()

const iframe = ref()

function updateIframe(codeWithoutImports: string, imports: string) {
  const source = `
  <html>
    <script type="importmap">
      {
        "imports": {
          "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js",
          "@es-js/terminal": "https://unpkg.com/@es-js/terminal@latest/dist/terminal.es.js"
        }
      }
    <\/script>

    <body style="margin: 0; padding: 0; background-color: #000;">
      <es-terminal style="width: 100%; height: 100%; position: absolute; top: 0; right: 0; bottom: 0; left: 0;"></es-terminal>
    </body>

    <script type="module">
    ${imports}

    ${codeWithoutImports}
    <\/script>
  </html>
  `

  iframe.value.srcdoc = source
}

onMounted(() => {
  const { codeWithoutImports, imports } = editor.transpileCode(editor.output.value)

  updateIframe(codeWithoutImports, imports)
})
</script>

<template>
  <div class="flex flex-col" style="max-height: calc(100vh - 46px)">
    <div class="flex flex-row px-0.5 pt-0.5 bg-gray-800 text-gray-50">
      <div class="flex flex-row items-center space-x-2 bg-gray-900 rounded-t px-2">
        <span class="text-md">Terminal</span>
        <button
          class="flex flex-row items-center py-0.5 px-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs rounded"
          @click="editor.execute()"
        >
          <PlayIcon class="w-4 h-4 mr-1" />
          Ejecutar
        </button>
      </div>
    </div>

    <div class="flex flex-grow">
      <iframe ref="iframe" class="w-full h-full b-0" />
    </div>
  </div>
</template>
