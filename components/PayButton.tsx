"use client";

import { Download } from "lucide-react";
import { Button } from "./ui/button";

export default function ExportPayButton() {
  const handlePayment = async () => {
    // 1. Create order on your backend
    const res = await fetch("/api/order", {
      method: "POST",
      body: JSON.stringify({ amount: 99 }), // your price in INR
    });

    const order = await res.json();
    if (!order.id) {
      alert("Error creating payment order");
      return;
    }

    // 2. Razorpay options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Your App Name",
      description: "Export purchase",
      order_id: order.id,

      handler: function (response: any) {
        console.log("Payment success:", response);
        // 👉 You can unlock export feature here
      },

      theme: { color: "#6366f1" },
    };

    // 3. Open Razorpay checkout
    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return (
    <Button
      size="sm"
      onClick={handlePayment}
      className="animate-pulse-glow"
    >
      <Download className="w-4 h-4 mr-2" />
      Export
    </Button>
  );
}
