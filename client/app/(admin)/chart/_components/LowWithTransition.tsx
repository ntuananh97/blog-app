"use client"


import React, { useState, useEffect, useRef } from 'react';

// --- KỂU DỮ LIỆU ---
interface TicketData {
  id: string;
  label: string;
  price: number;
}

// --- COMPONENT TICKET (Phiên bản dùng CSS Class & Timeout) ---
const Ticket: React.FC<TicketData> = ({ label, price }) => {
  const previousPrice = useRef(price);
  
  // 1. Phải thêm State để quản lý UI (Tăng render thừa)
  const [flashType, setFlashType] = useState<'up' | 'down' | 'idle'>('idle');

  useEffect(() => {
    if (price !== previousPrice.current) {
      const isUp = price > previousPrice.current;
      
      // Kích hoạt class màu
      setFlashType(isUp ? 'up' : 'down');
      previousPrice.current = price;

      // 2. Phải dùng setTimeout để gỡ class, đưa background về trong suốt
      const timer = setTimeout(() => {
        setFlashType('idle');
      }, 150);

      // 3. Bắt buộc phải có cleanup clearTimeout.
      // Nếu không, ở tần suất cao, timer của lần render trước sẽ xóa nhầm class của lần render sau.
      return () => clearTimeout(timer);
    }
  }, [price]);

  // Xác định class Tailwind dựa trên state
  let bgClass = 'bg-transparent';
  if (flashType === 'up') bgClass = 'bg-green-200/50'; // Màu xanh nhạt
  if (flashType === 'down') bgClass = 'bg-red-200/50'; // Màu đỏ nhạt

  return (
    <div
      className={`border border-slate-200 rounded-xl p-6 w-48 shadow-sm flex flex-col items-center justify-center 
        transition-colors duration-150 ease-out ${bgClass}`}
    >
      <span className="text-slate-500 font-medium mb-2">{label}</span>
      <span className="text-2xl font-bold font-mono tracking-tight text-slate-800">
        ${price.toFixed(2)}
      </span>
    </div>
  );
};

// --- APP CHÍNH (Giữ nguyên logic sinh dữ liệu) ---
export default function RealtimeTicketsAppCSS() {
  const [tickets, setTickets] = useState<TicketData[]>([
    { id: 't1', label: 'Ticket A', price: 100.00 },
    { id: 't2', label: 'Ticket B', price: 250.50 },
    { id: 't3', label: 'Ticket C', price: 50.75 },
  ]);
  
  const [updatesPerSecond, setUpdatesPerSecond] = useState<number>(10);

  useEffect(() => {
    if (updatesPerSecond <= 0) return;
    const intervalMs = 1000 / updatesPerSecond;

    const timer = setInterval(() => {
      setTickets((prev) =>
        prev.map((ticket) => ({
          ...ticket,
          price: Math.max(0, ticket.price + (Math.random() * 5 - 2.5)),
        }))
      );
    }, intervalMs);

    return () => clearInterval(timer);
  }, [updatesPerSecond]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-3xl w-full flex flex-col items-center gap-10">
        
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

        <div className="flex flex-row flex-wrap justify-center gap-6">
          {tickets.map((ticket) => (
            <Ticket key={ticket.id} {...ticket} />
          ))}
        </div>
        
      </div>
    </div>
  );
}