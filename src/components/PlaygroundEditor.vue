<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { onMounted } from 'vue'
import { Registry } from 'monaco-textmate'
import { wireTmGrammars } from 'monaco-editor-textmate'
import esjsSyntax from '@es-js/language-tools/esjs.tmLanguage.json'
import { useEditor } from '@/composables/useEditor'
import vsCodeDarkConverted from '@/assets/vscode-dark-converted.json'

const editor = useEditor()

const INITIAL_CODE = `/**
  EsJS: JavaScript en Español.

  Este código será transpilado a JavaScript, y ejecutado junto a una Terminal.
*/

importar { Terminal } desde '@es-js/terminal'

asincrono funcion inicio() {
  Terminal.limpiar()

  Terminal.escribir('Ingresa un valor:')

  const resultado = esperar Terminal.leer()

  Terminal.escribir({
    Resultado: resultado,
    Tipo: tipoDe resultado,
  })

  Terminal.escribir('Presiona ENTER para volver a iniciar')

  esperar Terminal.leerEnter()

  esperar inicio()
}

inicio()
`

onMounted(async () => {
  const monacoEditorElement = document.getElementById('monacoEditorElement')

  if (monacoEditorElement) {
    monaco.editor.defineTheme('vs-code-dark-converted', vsCodeDarkConverted)

    const monacoEditor = monaco.editor.create(monacoEditorElement, {
      value: INITIAL_CODE,
      automaticLayout: true,
      theme: 'vs-code-dark-converted',
      fontFamily: 'Fira Code',
      fontSize: 16,
      language: 'esjs',
      renderWhitespace: 'all',
      roundedSelection: true,
    })

    const registry = new Registry({
      getGrammarDefinition: async () => {
        return {
          format: 'json',
          content: esjsSyntax,
        }
      },
    })

    const grammars = new Map()
    grammars.set('esjs', 'source.esjs')

    monaco.languages.register({ id: 'esjs' })

    await wireTmGrammars(monaco, registry, grammars, monacoEditor)

    monaco.languages.registerCompletionItemProvider('esjs',
      {
        triggerCharacters: ['>'],
        provideCompletionItems: (model, position) => {
          // TODO: Implementar https://github.com/microsoft/monaco-editor/issues/221#issuecomment-1085787520.
          const codePre: string = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          })

          const tag = codePre.match(/.*<(\w+)>$/)?.[1]

          if (!tag)
            return

          const word = model.getWordUntilPosition(position)

          return {
            suggestions: [
              {
                label: `</${tag}>`,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                insertText: `$1</${tag}>`,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: word.startColumn,
                  endColumn: word.endColumn,
                },
              },
            ],
          }
        },
      })

    editor.setCode(monacoEditor.getValue())
    monacoEditor.onDidChangeModelContent(() => {
      editor.setCode(monacoEditor.getValue())
    })

    await editor.execute()
  }
})
</script>

<template>
  <div id="monacoEditorElement" ref="monacoEditor" />
</template>
