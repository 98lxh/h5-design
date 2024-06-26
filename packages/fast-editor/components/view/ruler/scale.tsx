import type { CSSProperties } from "vue";
import type { FC } from "vite-plugin-vueact";

import { useDarkMode } from "@fast-builder/shared";
import { ruler } from "../../../composables";

interface DefineProps {
  mode?: 'vertical' | 'horizontal';
  offsetX: number;
  offsetY: number;
  height: number;
  width: number;
  scale: number;
}

const Scale: FC<DefineProps> = function (props) {
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const { isDark } = useDarkMode()
  const styles = computed(() => {
    const styles: CSSProperties = {}
    styles.height = props.mode === 'horizontal' ? '22px' : '100%'
    styles.width = props.mode === 'horizontal' ? '100%' : '22px'
    styles.top = props.mode === 'horizontal' ? '0px' : '22px'
    return styles
  })

  const scale = () => ruler.scale(canvasRef, isDark, props)
  watch(() => [props.height, props.width, isDark.value], useDebounceFn(scale, 50), { deep: true })

  onMounted(scale)

  return (
    <canvas
      class="absolute bg-transparent flex-none block z-1"
      style={{ ...styles.value }}
      ref={canvasRef}
    />
  )
}

export default Scale;
