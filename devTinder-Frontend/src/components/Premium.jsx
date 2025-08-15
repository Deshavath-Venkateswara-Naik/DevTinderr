import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);

  // ✅ Verify premium status on mount
  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });
      if (res.data.isPremium) {
        setIsUserPremium(true);
      }
    } catch (error) {
      console.error("Error verifying premium status:", error);
    }
  };

  const handleBuyClick = async (type) => {
    try {
      const order = await axios.post(
        BASE_URL + "/payment/create",
        { membershipType: type },
        { withCredentials: true }
      );

      const { amount, keyId, currency, notes, orderId } = order.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Dev Tinder",
        description: "Connect to other developers",
        order_id: orderId,
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.emailId,
          contact: "9999999999",
        },
        theme: { color: "#2563EB" },
        handler: verifyPremiumUser,
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  // ✅ If already premium, show message
  if (isUserPremium) {
    return (
      <div className="text-center my-20 text-lg font-semibold text-green-600">
        🎉 You're already a premium user!
      </div>
    );
  }

  // ✅ Premium plans display
  return (
    <div className="m-10">
      <div className="flex w-full flex-col lg:flex-row gap-10 justify-center items-center">
        
        {/* Silver Plan */}
        <div className="relative card backdrop-blur-lg bg-white/60 border border-gray-200 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-xl p-6 w-80 text-center">
          <h1 className="font-extrabold text-2xl mb-4 bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent">
            Silver Membership
          </h1>
          <ul className="text-gray-700 space-y-2 mb-6 text-sm">
            <li>✅ Chat with other people</li>
            <li>✅ 100 connection requests/day</li>
            <li>✅ Blue Tick</li>
            <li>📅 3 months</li>
          </ul>
          <button
            onClick={() => handleBuyClick("silver")}
            className="btn w-full bg-gray-600 hover:bg-gray-800 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gray-400"
          >
            Buy Silver
          </button>
        </div>

        {/* Gold Plan - Most Popular */}
        <div className="relative card backdrop-blur-lg bg-white/70 border-2 border-yellow-400 shadow-2xl hover:shadow-yellow-500/50 hover:scale-110 transition-all duration-300 rounded-xl p-6 w-80 text-center">
          {/* Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-white text-xs font-bold py-1 px-4 rounded-full shadow-md">
            ⭐ Most Popular
          </div>
          <h1 className="font-extrabold text-2xl mb-4 bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
            Gold Membership
          </h1>
          <ul className="text-gray-700 space-y-2 mb-6 text-sm">
            <li>✅ Chat with other people</li>
            <li>✅ Unlimited connection requests/day</li>
            <li>✅ Blue Tick</li>
            <li>📅 6 months</li>
          </ul>
          <button
            onClick={() => handleBuyClick("gold")}
            className="btn w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400"
          >
            Buy Gold
          </button>
        </div>

      </div>
    </div>
  );
};

export default Premium;
