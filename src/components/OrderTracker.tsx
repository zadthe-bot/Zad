import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, MapPin, Phone, MessageSquare, ShieldCheck, ArrowLeft, Bike, UtensilsCrossed, Sparkles } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackerProps {
  order: Order;
  onBackToExplore: () => void;
}

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'confirmed', label: 'Order Placed', desc: 'Sent to restaurant' },
  { key: 'preparing', label: 'Preparing', desc: 'Kitchen is cooking your meal' },
  { key: 'picked_up', label: 'Picked Up', desc: 'Driver collected your food' },
  { key: 'on_the_way', label: 'On the Way', desc: 'Courier is arriving soon' },
  { key: 'delivered', label: 'Delivered', desc: 'Enjoy your meal!' },
];

export const OrderTracker: React.FC<OrderTrackerProps> = ({ order, onBackToExplore }) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [minutesLeft, setMinutesLeft] = useState<number>(order.estimatedDeliveryMinutes || 24);
  const [showCallModal, setShowCallModal] = useState<boolean>(false);
  const [showChatModal, setShowChatModal] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'driver' | 'user'; text: string }[]>([
    { sender: 'driver', text: "Hi! I'm on my way to pick up your order at " + order.restaurant.name + "." }
  ]);
  const [userChatInput, setUserChatInput] = useState<string>('');

  // Auto-progress order status simulation for realistic demo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStatus((prev) => {
        if (prev === 'confirmed') return 'preparing';
        if (prev === 'preparing') return 'picked_up';
        if (prev === 'picked_up') return 'on_the_way';
        if (prev === 'on_the_way') return 'delivered';
        return prev;
      });

      setMinutesLeft((m) => Math.max(0, m - 5));
    }, 12000); // Progress every 12s for prototype demonstration

    return () => clearInterval(timer);
  }, []);

  const getCurrentStepIndex = () => {
    return STATUS_STEPS.findIndex((s) => s.key === currentStatus);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userChatInput.trim() }]);
    const sent = userChatInput;
    setUserChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'driver', text: "Got it! Thanks for letting me know." },
      ]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Navigation & Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToExplore}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          Order #{order.id}
        </span>
      </div>

      {/* Main Status Hero */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md mb-6 relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {currentStatus === 'delivered' ? 'Arrived!' : 'Estimated Arrival'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              {currentStatus === 'delivered' ? (
                <span className="text-emerald-600">Delivered!</span>
              ) : (
                `${minutesLeft} - ${minutesLeft + 5} mins`
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Delivering from <strong className="text-slate-800">{order.restaurant.name}</strong> to{' '}
              <strong className="text-slate-800">{order.deliveryAddress}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={order.restaurant.logoImage}
              alt={order.restaurant.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
            />
          </div>
        </div>

        {/* Progress Tracker Steps */}
        <div className="mt-8">
          <div className="relative flex items-center justify-between">
            
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
            
            {/* Active Filled Line */}
            <div
              className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-700"
              style={{
                width: `${(getCurrentStepIndex() / (STATUS_STEPS.length - 1)) * 100}%`,
              }}
            />

            {STATUS_STEPS.map((step, idx) => {
              const isPassed = idx <= getCurrentStepIndex();
              const isCurrent = idx === getCurrentStepIndex();

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-orange-500 text-white ring-4 ring-orange-100 scale-110 shadow-md'
                        : isPassed
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border-2 border-slate-200 text-slate-400'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>

                  <span
                    className={`text-[10px] sm:text-xs font-bold mt-2 text-center max-w-[70px] sm:max-w-none ${
                      isCurrent ? 'text-orange-600 font-extrabold' : 'text-slate-600'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}

          </div>
        </div>

      </div>

      {/* Simulated Live Route Map */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-lg mb-6 relative overflow-hidden h-52 sm:h-64 flex flex-col justify-between">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 backdrop-blur-md text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live GPS Tracking</span>
          </div>

          <span className="text-xs text-slate-400 font-mono">Simulated Delivery View</span>
        </div>

        {/* Visual Route Graphic Simulation */}
        <div className="relative z-10 my-auto py-2">
          <div className="flex items-center justify-between max-w-md mx-auto px-6">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500 text-orange-400 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-400 font-semibold mt-1">Kitchen</span>
            </div>

            {/* Dotted Line */}
            <div className="flex-1 h-0.5 border-t-2 border-dashed border-orange-500/50 mx-4 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white p-1.5 rounded-full shadow-lg shadow-orange-500/50 animate-bounce">
                <Bike className="w-4 h-4" />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-400 font-semibold mt-1">You</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
          <span>Driver: <strong className="text-white">{order.driver?.name}</strong></span>
          <span>Vehicle: <strong className="text-white">{order.driver?.vehicle}</strong></span>
        </div>
      </div>

      {/* Driver Card & Contact */}
      {order.driver && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={order.driver.avatar}
              alt={order.driver.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border-2 border-orange-500/20 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{order.driver.name}</h3>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-md">
                  ★ {order.driver.rating}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {order.driver.vehicle} • <span className="font-mono">{order.driver.plateNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowChatModal(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-orange-600" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setShowCallModal(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Phone className="w-4 h-4" />
              <span>Call Driver</span>
            </button>
          </div>
        </div>
      )}

      {/* Order Summary Details */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Order Summary
        </h3>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.cartItemId} className="flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-[11px]">
                  {item.quantity}x
                </span>
                <span className="font-medium text-slate-900">{item.dish.name}</span>
              </div>
              <span className="font-bold text-slate-900">${item.totalPrice.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>${order.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tip</span>
            <span>${order.tip.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Discount</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
            <span>Total Paid</span>
            <span className="text-orange-600">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Driver Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Calling {order.driver?.name}...</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">{order.driver?.phone}</p>
            <button
              onClick={() => setShowCallModal(false)}
              className="w-full py-2.5 rounded-full bg-red-500 text-white font-bold text-xs cursor-pointer hover:bg-red-600 transition-colors"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Driver Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col h-[450px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={order.driver?.avatar}
                  alt={order.driver?.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{order.driver?.name}</h4>
                  <span className="text-[10px] text-emerald-600 font-semibold">Active en route</span>
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium ${
                      msg.sender === 'user'
                        ? 'bg-orange-500 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                placeholder="Type a message to driver..."
                value={userChatInput}
                onChange={(e) => setUserChatInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-orange-600"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
