<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useEditor } from '@/composables/useEditor'

const editor = useEditor()

const iframe = ref()

function updateIframe(codeWithoutImports: string, imports: string) {
  const source = `
  <html class="w-full h-full p-0 m-0">
    <script type="importmap">
      {
        "imports": {
          "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js",
          "@es-js/esvue": "https://unpkg.com/@es-js/esvue@latest/dist/esvue.es.js"
        }
      }
    <\/script>

    <body class="m-0 p-0 bg-gray-800">
      <div id="app" class="h-[100vh]"></div>
    </body>

    <script type="module">
    import { createApp } from 'vue'
    import { Terminal, usarConsola } from '@es-js/esvue';
    const consola = usarConsola();

    const app = createApp({
      setup() {
        ${imports}

        (async () => {
            ${codeWithoutImports}
        })();
      },
      template: '<Terminal/>'
    });

    app.component('Terminal', Terminal);
    app.mount('#app');
    <\/script>

    <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"><\/script>

    <link rel="stylesheet" href="https://unpkg.com/@es-js/esvue@latest/dist/style.css" type="text/css" />
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
  <iframe ref="iframe" class="w-full h-full" />
</template>
