import type { FC } from "vite-plugin-vueact"
import { useMergeProps } from "@h5-designer/shared"

interface DefineProps {
  description?: string;
  imgUrl?: string;
}

const Empty: FC<DefineProps> = function (componentProps, { slots }) {
  const props = useMergeProps(componentProps, {
    description: 'no data',
    imgUrl: '/figure/empty.png'
  })

  return (
    <div class="flex flex-col justify-center items-center select-none" >
      <img src={props.value.imgUrl} class="w-[140px] h-[140px]" />
      {slots.description ? slots.description() : <p class="mt-[15px]"> {props.value.description} </p>}
      {slots.default && slots.default()}
    </div>
  )
}

export default Empty
