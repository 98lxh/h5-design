import { Empty } from "~/components/common"

function TabPage() {
  const router = useRouter()
  return (
    <div class="w-full h-full relative">
      <Empty
        class="absolute top-[50%] left-[50%] translate-[-50%]"
        onClick={() => router.push('/designer/start')}
        description="您还没有创作过页面"
        buttonText="立即创作"
      />
    </div>
  )
}

export default TabPage
