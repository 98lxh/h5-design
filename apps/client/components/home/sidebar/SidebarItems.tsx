import { HomeSideItems } from "~/constants/pageConstant"
import MessageBox from "~/components/MessageBox"

function SidebarItems() {
  const visible = shallowRef(false)
  const router = useRouter();

  function patch(isFinished?: boolean, path?: string){

    if(!isFinished || !path){
      visible.value = true;
      return;
    }

    router.push(path)
  }

  return (
    <>
      {
        HomeSideItems.map((item) => (
          item.divider ? <div class="my-2 border-b-1 dark:border-neutral" /> : (
              <div class="flex justify-center">
                <div class={`btn w-full ${item.class && item.class}`} onClick={() => patch(item.isFinished,item.patch)}>
                    <NuxtIcon name={item.icon} size="18px" />
                    <span>{item.text}</span>
                </div>
              </div>
          )
        ))
      }

      <MessageBox
        v-model:visible={visible.value}
        content="该功能尚未开发完成"
      />
    </>
  )
}

export default SidebarItems;
