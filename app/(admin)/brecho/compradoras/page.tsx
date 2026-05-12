import { CompradoresPageClient } from '@/components/brecho/compradoras-page-client'
import { getCompradoras } from '@/lib/store'

export const dynamic = 'force-dynamic'

export default function CompradoresPage() {
  const compradoras = getCompradoras()

  return (
    <div className="px-4 py-6 md:px-14 md:py-10 max-w-[1300px]">
      <CompradoresPageClient compradoras={compradoras} />
    </div>
  )
}
