"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const params = useSearchParams();
  const plan = 1;
  const amount = Number(plan);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startPayment = async () => {
    if (!form.name || !form.email || !form.phone) {
      alert("Please fill all details.");
      return;
    }

    setLoading(true);

    // 1️⃣ Create Razorpay order from backend
    const orderRes = await fetch("/api/order", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });

    const order = await orderRes.json();
    setLoading(false);

    if (!order?.id) {
      alert("Failed to create payment order");
      return;
    }

    // 2️⃣ Razorpay Checkout Config
    const options = {
      key: process.env.NEXT_PUBLIC_RZP_ID,
      amount: order.amount,
      currency: "INR",
      name: "Resume Builder",
      description: `${plan} Plan Purchase`,
      order_id: order.id,

      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },

      theme: {
        color: "#4F46E5",
      },

      handler: function (response: any) {
        console.log("Payment success:", response);

        // Store unlock
        localStorage.setItem("resume_unlocked", "true");

        // Redirect to success
        window.location.href = "/success";
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-10">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-2 text-gray-900 text-center">
          Checkout
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Complete your purchase to unlock your resume.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Form Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Details</h2>

            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-indigo-200"
            />

            <input
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-indigo-200"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-indigo-200"
            />
          </div>

          {/* Summary Section */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-inner space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>

            <div className="flex justify-between text-gray-700">
              <span>Plan Selected</span>
              <span>₹{amount}</span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Taxes</span>
              <span>₹0</span>
            </div>

            <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-lg">
              <span>Total</span>
              <span>₹{amount}</span>
            </div>

            <button
              onClick={startPayment}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              {loading ? "Processing..." : `Pay ₹${amount}`}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Payments are securely processed via Razorpay.
        </p>
      </div>
    </div>
  );
}
