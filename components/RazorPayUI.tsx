"use client"

import { useState } from "react"

export default function CheckoutPage() {
  const amount = 499 // example amount

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const startPayment = async () => {
    if (!form.name || !form.email || !form.phone) {
      alert("Fill all details")
      return
    }

    setLoading(true)

    const orderRes = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })

    const order = await orderRes.json()
    setLoading(false)

    if (!order?.id) {
      alert("Order creation failed")
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Resume Builder",
      description: "Premium Plan",
      order_id: order.id,

      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },

      handler: async function (response: any) {
        const res = await fetch("/api/save-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            plan: "PREMIUM",
            amount,
          }),
        })

        const data = await res.json()

        if (!data.success) {
          alert("Payment verification failed")
          return
        }

        window.location.href = "/builder"
      },
    }

    const razorpay = new (window as any).Razorpay(options)
    razorpay.open()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold text-center">Checkout</h1>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <button
          onClick={startPayment}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded font-semibold"
        >
          {loading ? "Processing..." : `Pay ₹${amount}`}
        </button>
      </div>
    </div>
  )
}
