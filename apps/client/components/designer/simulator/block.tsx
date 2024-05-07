import type { CSSProperties } from "vue";
import type { FC } from "vite-plugin-vueact";
import { mapMaterialComponents } from "@h5-designer/material";
import Resizable from "./resizable";

interface DefineProps {
  translateX: number;
  translateY: number;
}

interface DefineEmits {
  (name: 'updateWrapperRef', wrapperRef: HTMLElement | null): void
}

const Block: FC<DefineProps, DefineEmits> = function (props, { emit }) {
  const { simulatorData, setSimulatorDataById } = useDesignerContext()
  const clearBlockFocus = () => simulatorData.value.blocks.forEach(block => block.focus = false)
  const wrapperRef = useEventOutside({ event: 'mousedown', isOnlyChildContains: true }, clearBlockFocus)

  function down(_: MouseEvent, block: SimulatorBlock) {
    clearBlockFocus()
    block.focus = true
  }

  function move({ currentY, startX, startY, currentX }: MoveListenerOptions, block: SimulatorBlock) {
    const top = currentY - startY + block.style.top
    const left = currentX - startX + block.style.left
    const style = { ...block.style, left, top }
    setSimulatorDataById(block.id, { ...block, style })
  }

  const onMousedown = useDocumentMouseEvent({ down, move })

  const styles = computed<CSSProperties>(() => ({
    transform: `translate(${props.translateX}px,${props.translateY}px`,
    height: simulatorData.value.container?.height + 'px',
    width: simulatorData.value.container?.width + 'px',
  }))

  onMounted(() => emit('updateWrapperRef', wrapperRef.value))

  return (
    <div
      class={`shadow-custom  top-[60px] left-[30%] bg-base-100 absolute cursor-auto`}
      style={styles.value}
      ref={wrapperRef}
    >
      {
        simulatorData.value.blocks.map(block => (
          <Resizable
            onMousedown={(evt: MouseEvent) => onMousedown(evt, block)}
            block={block}
            key={block.id}
          >
            {
              mapMaterialComponents[block.key] &&
              mapMaterialComponents[block.key].setup(block.props)()
            }
          </Resizable>
        ))
      }
    </div>
  )
}


export default Block
