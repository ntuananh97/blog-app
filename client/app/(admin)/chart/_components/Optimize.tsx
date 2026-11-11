"use client"

import React, { useState, useEffect, useRef } from 'react';

// --- KỂU DỮ LIỆU ---
interface TicketData {
  id: string;
  label: string;
  price: number;
}

// --- COMPONENT TICKET ---
const Ticket: React.FC<TicketData> = ({ label, price }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousPrice = useRef(price);

  useEffect(() => {
    // Chỉ chạy hiệu ứng khi giá trị thực sự thay đổi
    if (containerRef.current && price !== previousPrice.current) {
      const isUp = price > previousPrice.current;
      // Tuỳ chọn màu chớp: Xanh nhạt nếu giá tăng, đỏ nhạt nếu giá giảm
      const flashColor = isUp ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)';

      // Sử dụng Web Animations API để đổi màu background và tan nhanh
      containerRef.current.animate(
        [
          { backgroundColor: flashColor },
          { backgroundColor: 'transparent' }
        ],
        {
          duration: 150, // Tan nhanh trong 150ms
          easing: 'ease-out',
        }
      );
      
      previousPrice.current = price;
    }
  }, [price]);

  return (
    <div
      ref={containerRef}
      className="border border-slate-200 rounded-xl p-6 w-48 shadow-sm flex flex-col items-center justify-center transition-colors"
    >
      <span className="text-slate-500 font-medium mb-2">{label}</span>
      <span className="text-2xl font-bold font-mono tracking-tight text-slate-800">
        ${price.toFixed(2)}
      </span>
    </div>
  );
};

// --- APP CHÍNH ---
export default function RealtimeTicketsApp() {
  const [tickets, setTickets] = useState<TicketData[]>([
    { id: 't1', label: 'Ticket A', price: 100.00 },
    { id: 't2', label: 'Ticket B', price: 250.50 },
    { id: 't3', label: 'Ticket C', price: 50.75 },
  ]);
  
  // Tham số điều chỉnh tần suất (mặc định 10 lần/s)
  const [updatesPerSecond, setUpdatesPerSecond] = useState<number>(10);

  // Hook giả lập dữ liệu realtime
  useEffect(() => {
    if (updatesPerSecond <= 0) return;

    const intervalMs = 1000 / updatesPerSecond;

    const timer = setInterval(() => {
      setTickets((prev) =>
        prev.map((ticket) => ({
          ...ticket,
          // Giả lập giá biến động ngẫu nhiên từ -2.5 đến +2.5
          price: Math.max(0, ticket.price + (Math.random() * 5 - 2.5)),
        }))
      );
    }, intervalMs);

    return () => clearInterval(timer);
  }, [updatesPerSecond]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-3xl w-full flex flex-col items-center gap-10">
        
        {/* Vùng điều khiển tần suất */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <label htmlFor="frequency" className="text-sm font-semibold text-slate-700">
            Tần suất (lần/giây):
          </label>
          <input
            id="frequency"
            type="number"
            min="1"
            max="60"
            value={updatesPerSecond}
            onChange={(e) => setUpdatesPerSecond(Number(e.target.value))}
            className="w-24 px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-center"
          />
        </div>

        {/* Vùng hiển thị 3 Ticket */}
        <div className="flex flex-row flex-wrap justify-center gap-6">
          {tickets.map((ticket) => (
            <Ticket key={ticket.id} {...ticket} />
          ))}
        </div>
        
      </div>
    </div>
  );
}