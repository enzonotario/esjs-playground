<script setup lang="ts">
import { onMounted, ref } from 'vue'
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
          "@es-js/consola": "https://unpkg.com/@es-js/consola@latest/dist/consola.es.js"
        }
      }
    <\/script>

    <body class="m-0 p-0">
      <div id="app" class="h-screen"></div>
    </body>

    <script type="module">
    import { createApp } from 'vue'
    import { EsConsola, usarConsola } from '@es-js/consola';
    const consola = usarConsola();

    const app = createApp({
      setup() {
        ${imports}

        (async () => {
            ${codeWithoutImports}
        })();
      },
      template: '<EsConsola/>'
    });

    app.component('EsConsola', EsConsola);
    app.mount('#app');
    <\/script>

    <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"><\/script>
    <link rel="stylesheet" href="https://unpkg.com/@es-js/consola@latest/dist/style.css" type="text/css" />
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
