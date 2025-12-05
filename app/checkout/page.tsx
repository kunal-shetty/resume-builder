"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const params = useSearchParams();
  const plan = params.get("plan") || ""; // "basic" / "advanced" / "premium"

  // SAFELY GET PRICE (cannot be manipulated)
  const baseAmount = PLAN_PRICING[plan] ?? null;

  if (!baseAmount) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        Invalid or corrupted plan link.
      </div>
    );
  }

  // TAX (5%)
  const taxRate = 0.05;
  const tax = Math.round(baseAmount * taxRate);
  const total = baseAmount + tax;

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = { name: "", email: "", phone: "" };
    let valid = true;

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
      valid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const startPayment = async () => {
    if (!validateForm()) return;

    setLoading(true);

    // CREATE ORDER USING SECURE TOTAL
    const orderRes = await fetch("/api/order", {
      method: "POST",
      body: JSON.stringify({ amount: total }),
    });

    const order = await orderRes.json();
    setLoading(false);

    if (!order?.id) {
      alert("Failed to create payment order");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Resume Builder",
      description: `${plan} Plan Purchase (incl. tax)`,
      order_id: order.id,

      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },

      theme: { color: "#4F46E5" },

      handler: function () {
        // Unlock correct plan
        localStorage.setItem("resume_unlocked", plan);
        window.location.href = "/success";
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-10">

        <h1 className="text-3xl font-bold mb-2 text-gray-900 text-center">
          Checkout
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Complete your purchase to unlock your resume.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT SECTION */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Details</h2>

            {/* NAME */}
            <div>
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.name ? "border-red-500 bg-red-50" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <input
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.email ? "border-red-500 bg-red-50" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.phone ? "border-red-500 bg-red-50" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-inner space-y-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="flex justify-between text-gray-700">
              <span>Plan Selected</span>
              <span>₹{baseAmount}</span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Tax (5%)</span>
              <span>₹{tax}</span>
            </div>

            <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={startPayment}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              {loading ? "Processing..." : `Pay ₹${total}`}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Payments are securely processed via Razorpay.
        </p>
      </div>
    </div>
  );
}

// PRICE TABLE
const PLAN_PRICING: Record<string, number> = {
  basic: 49,
  advanced: 99,
  premium: 149,
};
