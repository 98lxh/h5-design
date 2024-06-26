import { computed, InjectionKey, ref, shallowReactive, shallowRef } from "vue"
import { devices } from "@fast-builder/editor/constants/devices"
import { zoomOptions } from "@fast-builder/shared"
import { nanoid } from "nanoid"

export const editorInjectionKey: InjectionKey<EditorContext> = Symbol('DESIGNER_INJECTION_KEY')

export const genarateDefaultData = (): DesignerData => ({
  container: { id: nanoid(), top: 0, left: 0, focus: false, name: devices[0].name, width: devices[0].width, height: devices[0].height },
  blocks: []
})

export function useEditor() {
  const data = ref(genarateDefaultData())
  // 左右侧面边的折叠状态
  const collapse = shallowReactive({ left: false, right: false })
  // 当前编辑的组件or容器的ID
  const currentBlockID = shallowRef("")
  // 模拟器元素
  const simulatorRef = ref<HTMLElement | null>(null)
  // 容器缩放
  const zoom = shallowRef<string>(zoomOptions[3].key as string)
  /* 当前编辑的组件or容器 */
  const currentBlock = computed(() => {
    const { container, blocks } = data.value
    if (container.focus) { return convertContainerToBlock(container) }
    return blocks.find(({ id }) => currentBlockID.value === id)
  })

  /* 设置数据 */
  function setData(updatedData: DesignerData) {
    data.value = updatedData
  }
  /* 设置容器 */
  function setContainer(updated: Partial<Container>) {
    const { container } = data.value
    const updatedContainer = { ...container, ...updated }
    data.value.container = updatedContainer
  }
  /* 清除所有组件or容器的focus状态 */
  function clearBlockFocus() {
    currentBlockID.value = ""
    data.value.blocks.forEach(block => block.focus = false)
  }

  /* 设置组件的focus状态根据组件ID */
  function setContainerFocus() {
    clearBlockFocus()
    data.value.container.focus = true
  }

  /* 设置组件的focus状态根据组件ID */
  function setBlockFocus(blockId: string) {
    const index = data.value.blocks.findIndex(({ id }) => id === blockId)
    if (index < 0) { return }
    clearBlockFocus()
    setContainer({ focus: false })
    currentBlockID.value = blockId
    data.value.blocks[index].focus = true
  }

  /* 设置组件属性根据组件的ID */
  function setBlockById(updateId: string, block: Block) {
    const index = data.value.blocks.findIndex(({ id }) => id === updateId)
    if (index < 0) { return }
    data.value.blocks[index] = { ...block }
  }

  /* 根据组件ID设置组件的样式 */
  function setBlockStyleById(updateId: string, style: BlockStyle) {
    const index = data.value.blocks.findIndex(({ id }) => id === updateId)
    if (index < 0) { return }
    const block = data.value.blocks[index]
    data.value.blocks[index] = { ...block, style }
  }

  /* 根据组件ID删除组件 */
  function deleteBlockById(deleteId: string) {
    const index = data.value.blocks.findIndex(({ id }) => id === deleteId)
    if (index === -1) { return }
    data.value.blocks.splice(index, 1)
  }


  return {
    zoom,
    collapse,
    setBlockStyleById,
    deleteBlockById,
    clearBlockFocus,
    currentBlockID,
    currentBlock,
    setBlockFocus,
    setContainerFocus,
    setContainer,
    setBlockById,
    simulatorRef,
    setData,
    data
  }
}

export type EditorContext = ReturnType<typeof useEditor>

// 获取最大层级
export function getMaxIndex(blocks: Block[]) {
  const zIndex = blocks.map(({ style }) => Number(style.zIndex))
  return zIndex.length === 0 ? 0 : Math.max.apply(Math, zIndex)
}


/* 容器的key */
export const EDITOR_CONTAINER_KEY = 'EDITOR_CONTAINER'
/* 将容器转换成组件 */
export function convertContainerToBlock(container: Container, blocks?: Block[]): Block {
  const { top, left, height, width, name, focus, id } = container
  return {
    style: { height, width, top, left, zIndex: 0 },
    blocks: blocks ? blocks : [],
    key: EDITOR_CONTAINER_KEY,
    icon: 'IconBlock',
    label: '容器',
    focus,
    name,
    id
  }
}


export function useEditorContext() {
  const context = inject(editorInjectionKey, useEditor())
  return context;
}
