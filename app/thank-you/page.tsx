export default function ThankYouPage({ searchParams }: { searchParams: { type?: string } }) {
  const isPickup = (searchParams.type || "order") === "pickup";
  return (
    <main className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white border border-amber-200 rounded-3xl p-10 text-center shadow-lg">
        <div className="text-5xl mb-4">{isPickup ? "📍" : "📦"}</div>
        <h1 className="text-2xl font-bold text-amber-900">{isPickup ? "Pickup Reserved ✅" : "Order Confirmed ✅"}</h1>
        <p className="mt-3 text-slate-700 leading-relaxed">
          {isPickup ? "We received your Orangevale pickup reservation. We'll reach out within 24 hours to confirm pickup timing. No payment required until you arrive."
                    : "Thanks for your order! You'll receive a confirmation email shortly with tracking information."}
        </p>
        <div className="mt-6 p-4 bg-amber-50 rounded-2xl text-sm text-amber-800">
          <p className="font-semibold">What happens next?</p>
          <p className="mt-1">{isPickup ? "We'll call or email you to confirm timing and exact pickup location." : "Your order is being prepared. Expect delivery within 2–5 business days."}</p>
        </div>
        <a href="/" className="inline-block mt-8 px-8 py-3 rounded-2xl bg-amber-700 text-white font-bold hover:bg-amber-800 transition">Back to Home</a>
      </div>
    </main>
  );
}
