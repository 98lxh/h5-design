import type { CSSProperties } from "vue";
import type { FC } from "vite-plugin-vueact";
import { mapMaterialComponents } from "@h5-designer/material";

interface DefineProps {
  translateX: number;
  translateY: number;
}


interface DefineEmits {
  (name: 'updateWrapperRef', wrapperRef: HTMLDivElement | null): void
}

const Block: FC<DefineProps, DefineEmits> = function (props, { emit }) {
  const wrapperRef = ref<HTMLDivElement | null>(null);
  const context = inject(designerInjectionKey);

  const wrapperStyles = computed<CSSProperties>(() => {
    const container = context?.simulatorData.value?.container
    return {
      transform: `translate(${props.translateX}px,${props.translateY}px`,
      height: container?.height + 'px',
      width: container?.width + 'px',
    }
  })

  function generateBlockStyles(block: SimulatorBlock) {
    return {
      top: block.top + 'px',
      left: block.left + 'px',
      zIndex: block.zIndex,
      transform: 'translate(-50%,-50%)'
    }
  }

  function onClickOutside(evt: MouseEvent) {
    if (!wrapperRef.value) { return  }
    const child = [... wrapperRef.value.childNodes]
    const isContains = child.some(children => children.contains(evt.target as HTMLElement))
    if(isContains){ return }
    clearBlockFocus();
  }

  function onMousedown(evt: MouseEvent, block: SimulatorBlock) {
    !evt.shiftKey && clearBlockFocus();
    block.focus = true;
  }

  function clearBlockFocus() {
    context?.simulatorData.value.blocks.forEach(block => block.focus = false)
  }

  onMounted(() => {
    emit('updateWrapperRef', wrapperRef.value)
    document.documentElement.addEventListener('click', onClickOutside)
  })

  onUnmounted(() => document.documentElement.removeEventListener('click', onClickOutside))


  return (
    <div
      class={`shadow-custom  top-[60px] left-[30%] bg-base-100 absolute cursor-auto`}
      style={wrapperStyles.value}
      ref={wrapperRef}
    >
      {
        context?.simulatorData.value?.blocks.map((block, index) => (
          <div
            class={`block absolute ${block.focus ? 'block-focus' : ''}`}
            onMousedown={evt => onMousedown(evt, block)}
            style={generateBlockStyles(block)}
            key={index}
          >
            {mapMaterialComponents[block.key] && mapMaterialComponents[block.key].setup(block.props)()}
          </div>
        ))
      }
    </div>
  )
}


export default Block
