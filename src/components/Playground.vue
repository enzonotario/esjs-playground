<script setup lang="ts">
import VueSplitView from 'vue-split-view'
import OutputIframe from '@/components/OutputIframe.vue'
import { useEditor } from '@/composables/useEditor'
import PlaygroundEditor from '@/components/PlaygroundEditor.vue'
import 'vue-split-view/dist/style.css'

const editor = useEditor()

const view = 'horizontal'
</script>

<template>
  <div class="flex flex-row w-full h-full">
    <VueSplitView :direction="view" class="overflow-hidden">
      <template #A>
        <PlaygroundEditor class="w-full h-full overflow-hidden" />
      </template>
      <template #B>
        <OutputIframe v-if="editor.output.value" class="w-full h-full overflow-hidden" />
      </template>
    </VueSplitView>
  </div>
</template>
