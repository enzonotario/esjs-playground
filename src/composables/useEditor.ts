import { ref } from 'vue'
import { splitCodeImports, transpile } from '@es-js/core'

const code = ref('')

const output = ref()

export const useEditor = () => {
  function setCode(value: string) {
    code.value = value
  }

  function cleanPreviousExecution() {
    output.value = null
  }

  async function execute() {
    cleanPreviousExecution()

    setTimeout(() => {
      output.value = transpile(code.value)
    })
  }

  function transpileCode(code: string) {
    return splitCodeImports(code)
  }

  return {
    code,
    output,
    execute,
    transpileCode,
    setCode,
  }
}
