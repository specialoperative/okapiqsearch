import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buy Box - Okapiq',
}

export default function BuyBoxPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Acquisition Criteria (Buy Box)</h1>
      <p className="text-gray-700 mb-8">
        Avila Peak Partners is an entrepreneurial investment firm seeking to acquire and operate a high-quality U.S.-based business.
        We focus on opportunities with strong fundamentals, capable management, and the potential for long-term growth.
      </p>

      <div className="space-y-6">
        <section className="rounded border bg-white p-5">
          <div className="text-sm text-gray-500">Industries</div>
          <div className="font-medium">Business Services, Consumer Services, Distribution</div>
        </section>

        <section className="rounded border bg-white p-5">
          <div className="text-sm text-gray-500">Location</div>
          <div className="font-medium">U.S.-based companies only</div>
        </section>

        <section className="rounded border bg-white p-5">
          <div className="text-sm text-gray-500">Financial Criteria</div>
          <ul className="list-disc ml-5 mt-2 text-gray-800">
            <li>$300K+ EBITDA</li>
            <li>$1.5M+ revenue</li>
            <li>Selling at 3x EBITDA multiples or higher</li>
            <li>Purchase price between $1.5M and $7M</li>
          </ul>
        </section>

        <section className="rounded border bg-white p-5">
          <div className="text-sm text-gray-500">Operational Criteria</div>
          <div className="font-medium">
            Strong second-level management in place or remotely ownable operations; overseas outsourcing capabilities are appealing
          </div>
        </section>

        <section className="rounded border bg-white p-5">
          <div className="text-sm text-gray-500">Preferred Attributes</div>
          <div className="font-medium">Recurring revenue models; low customer concentration</div>
        </section>

        <section className="rounded border bg-white p-5">
          <div className="text-sm text-gray-500">Deal Types</div>
          <div className="font-medium">Asset or stock purchases, open to seller financing per SBA guidelines</div>
        </section>

        <section className="rounded border bg-white p-5">
          <div className="text-sm text-gray-500">Contact</div>
          <div className="font-medium space-x-3">
            <a className="text-emerald-700 hover:text-emerald-900" href="mailto:juanmendoza@avilapeakpartners.com">juanmendoza@avilapeakpartners.com</a>
            <span className="text-gray-400">|</span>
            <a className="text-emerald-700 hover:text-emerald-900" href="mailto:marcomendoza@avilapeakpartners.com">marcomendoza@avilapeakpartners.com</a>
          </div>
        </section>

        <div className="pt-2">
          <a href="/crm" className="inline-block px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700">Submit a deal</a>
        </div>
      </div>
    </main>
  )
}


