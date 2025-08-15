import React from 'react'

export default function BuyBoxPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Acquisition Criteria (Buy Box)</h1>
      <p className="text-gray-700 mb-8">
        Avila Peak Partners is an entrepreneurial investment firm seeking to acquire and operate a high-quality U.S.-based business. We focus on opportunities with strong fundamentals, capable management, and the potential for long-term growth.
      </p>

      <div className="space-y-6">
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Industries</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Business Services</li>
            <li>Consumer Services</li>
            <li>Distribution</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Location</h2>
          <p className="text-gray-700">U.S.-based companies only</p>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Financial Criteria</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>$300K+ EBITDA</li>
            <li>$1.5M+ revenue</li>
            <li>Selling at 3x EBITDA multiples or higher</li>
            <li>Purchase price between $1.5M and $7M</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Operational Criteria</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Strong second-level management in place or remotely ownable operations</li>
            <li>Overseas outsourcing capabilities are appealing</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Preferred Attributes</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Recurring revenue models</li>
            <li>Low customer concentration</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Deal Types</h2>
          <p className="text-gray-700">Asset or stock purchases; open to seller financing per SBA guidelines</p>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
          <ul className="text-gray-700">
            <li><a className="text-emerald-700 hover:text-emerald-900" href="mailto:juanmendoza@avilapeakpartners.com">juanmendoza@avilapeakpartners.com</a></li>
            <li><a className="text-emerald-700 hover:text-emerald-900" href="mailto:marcomendoza@avilapeakpartners.com">marcomendoza@avilapeakpartners.com</a></li>
          </ul>
        </section>

        <div className="flex gap-3">
          <a href="/oppy" className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Scan markets against this Buy Box</a>
          <a href="/crm" className="px-4 py-2 rounded-md border">Open CRM</a>
        </div>
      </div>
    </main>
  )
}


