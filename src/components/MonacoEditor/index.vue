<template>
  <div class="the-code-editor-container" ref="editorLayout" :style="`width:${props.width}; height:${props.height};`">
    <div>
      <el-icon v-if="isMaximum"><semi-select @click="minEditor"/></el-icon>
      <el-icon v-else><full-screen @click="maxEditor"/></el-icon>
    </div>
    <div ref="codeEditBox" class="codeEditBox"/>
  </div>
</template>

<script setup>
import * as monaco from 'monaco-editor'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import {language as sqlLanguage} from 'monaco-editor/esm/vs/basic-languages/sql/sql.js';
import {language as yamlLanguage} from 'monaco-editor/esm/vs/basic-languages/yaml/yaml.js';
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution'
import {editorProps} from './MonacoEditorType'

const props = defineProps(editorProps);
const emit = defineEmits(['update:modelValue', 'change', 'editor-mounted']);
let editor;
const editorLayout = ref();
const codeEditBox = ref();
const isMaximum = ref(false);
const originSize = ref({})

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new JsonWorker()
    }
    if (['css', 'scss', 'less'].includes(label)) {
      return new CssWorker()
    }
    if (['html', 'handlebars', 'razor'].includes(label)) {
      return new HtmlWorker()
    }
    if (['typescript', 'javascript'].includes(label)) {
      return new TsWorker()
    }
    return new EditorWorker()
  },
}

function init() {
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
  })
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
  })
  monaco.languages.registerCompletionItemProvider('sql', {
    provideCompletionItems() {
      const suggestions = [];
      // 这个keywords就是sql.js文件中有的
      sqlLanguage.keywords.forEach((item) => {
        suggestions.push({
          label: item,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: item,
        });
      })
      sqlLanguage.operators.forEach((item) => {
        suggestions.push({
          label: item,
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: item,
        });
      })
      sqlLanguage.builtinFunctions.forEach((item) => {
        suggestions.push({
          label: item,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: item,
        });
      })
      sqlLanguage.builtinVariables.forEach((item) => {
        suggestions.push({
          label: item,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: item,
        });
      })
      return {
        suggestions, // 最后要返回一个数组
      };
    },
  })
  monaco.languages.registerCompletionItemProvider('yaml', {
    provideCompletionItems() {
      const suggestions = [];
      // 这个keywords就是python.js文件中有的
      yamlLanguage.keywords.forEach((item) => {
        suggestions.push({
          label: item,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: item,
        });
      })
      return {
        suggestions, // 最后要返回一个数组
      };
    },
  })

  editor = monaco.editor.create(codeEditBox.value, {
    value: props.modelValue,
    language: props.language,
    readOnly: props.readOnly,
    theme: props.theme,
    autoIndex: true,
    ...props.options,
  })

  // 监听值的变化
  editor.onDidChangeModelContent(() => {
    const value = editor.getValue() // 给父组件实时返回最新文本
    emit('update:modelValue', value)
    emit('change', value)
  })

  emit('editor-mounted', editor)
}


// 放大
function maxEditor() {
  isMaximum.value = true
  originSize.value = {
    width: editorLayout.value.clientWidth,
    height: editorLayout.value.clientHeight
  }
  editorLayout.value.classList.add('editor-fullscreen')
  editor.layout({
    height: document.body.clientHeight,
    width: document.body.clientWidth
  })
}
// 缩小
function minEditor() {
  isMaximum.value = false
  editorLayout.value.classList.remove('editor-fullscreen')
  editor.layout({
    height: originSize.value.height,
    width: originSize.value.width
  })
}

watch(() => props.modelValue,
    (newValue) => {
      if(newValue === null) {
        newValue = ''
      }
      if (editor) {
        const value = editor.getValue()
        if (newValue !== value) {
          editor.setValue(newValue)
        }
      }
    },
)

watch(
    () => props.options,
    (newValue) => {
      editor.updateOptions(newValue)
    },
    {deep: true},
)
watch(
    () => props.readOnly,
    () => {
      editor.updateOptions({readOnly: props.readOnly})
    },
    {deep: true},
)

watch(
    () => props.language,
    (newValue) => {
      monaco.editor.setModelLanguage(editor.getModel(), newValue)
    },
)

onBeforeUnmount(() => {
  editor.dispose()
})

onMounted(() => {
  init()
})

</script>

<style lang="scss" scoped>
.codeEditBox222 {
  width: 100%;
  flex: 1;
  min-height: 120px;
  overflow-y: auto;
}

.editor-fullscreen {
  position: fixed !important;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
  z-index: 10000;
}

.the-code-editor-container {
  width: 100%;
  height: 100%;
  position: relative;
  [class^="el-icon"] {
    font-size: 20px;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 0;
    z-index: 9999;
    color: #fff;
  }
  .codeEditBox {
    width: 100%;
    min-height: 240px;
    height: 100%;
    overflow: auto;
  }
  .monaco-editor .scroll-decoration {
    box-shadow: none;
  }
}
</style>

