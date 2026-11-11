"use client"

import React, { useState, useEffect, useRef } from 'react';

interface TicketConfig {
  id: string;
  label: string;
}

const TICKETS_CONFIG: TicketConfig[] = [
  { id: 't1', label: 'Ticket A' },
  { id: 't2', label: 'Ticket B' },
  { id: 't3', label: 'Ticket C' },
];

// --- COMPONENT TICKET TỐI ƯU (Không dùng State cho Price) ---
const Ticket: React.FC<{
  config: TicketConfig;
  latestPricesRef: React.MutableRefObject<Record<string, number>>;
}> = ({ config, latestPricesRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const priceSpanRef = useRef<HTMLSpanElement>(null);
  
  // Lưu lại giá trị của frame trước đó để so sánh
  const lastRenderedPrice = useRef(latestPricesRef.current[config.id]);

  useEffect(() => {
    let frameId: number;

    const updateFrame = () => {
      // 1. Lấy giá mới nhất từ bộ nhớ (không chờ React render)
      const currentPrice = latestPricesRef.current[config.id];

      // 2. Chỉ cập nhật DOM nếu giá thực sự có thay đổi so với frame trước
      if (currentPrice !== lastRenderedPrice.current) {
        
        // Cập nhật Text DOM trực tiếp (Bypass React Virtual DOM)
        if (priceSpanRef.current) {
          priceSpanRef.current.innerText = `$${currentPrice.toFixed(2)}`;
        }

        // Kích hoạt hiệu ứng nhấp nháy bằng Web Animations API
        if (containerRef.current) {
          const isUp = currentPrice > lastRenderedPrice.current;
          containerRef.current.animate(
            [
              { backgroundColor: isUp ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)' },
              { backgroundColor: 'transparent' }
            ],
            { duration: 150, easing: 'ease-out' }
          );
        }

        lastRenderedPrice.current = currentPrice;
      }

      // 3. Gọi lại chính nó cho frame tiếp theo (Màn hình 60Hz sẽ gọi 60 lần/s)
      frameId = requestAnimationFrame(updateFrame);
    };

    // Bắt đầu vòng lặp animation
    frameId = requestAnimationFrame(updateFrame);

    return () => cancelAnimationFrame(frameId); // Cleanup khi unmount
  }, [config.id, latestPricesRef]);

  return (
    <div
      ref={containerRef}
      className="border border-slate-200 rounded-xl p-6 w-48 shadow-sm flex flex-col items-center justify-center transition-colors"
    >
      <span className="text-slate-500 font-medium mb-2">{config.label}</span>
      {/* 
        Giá trị khởi tạo ban đầu. 
        Sau đó, nội dung thẻ span này sẽ bị ghi đè bởi rAF thông qua DOM thao tác trực tiếp.
      */}
      <span 
        ref={priceSpanRef} 
        className="text-2xl font-bold font-mono tracking-tight text-slate-800"
      >
        ${latestPricesRef.current[config.id].toFixed(2)}
      </span>
    </div>
  );
};

// --- APP CHÍNH ---
export default function RealtimeTicketsAppRAF() {
  // Bộ nhớ chung chứa dữ liệu mới nhất. Thay đổi ref không làm component render lại!
  const latestPricesRef = useRef<Record<string, number>>({
    t1: 100.00,
    t2: 250.50,
    t3: 50.75,
  });

  const [updatesPerSecond, setUpdatesPerSecond] = useState<number>(100);

  // Hook giả lập luồng dữ liệu 100Hz (Ví dụ: WebSocket onmessage)
  useEffect(() => {
    if (updatesPerSecond <= 0) return;
    const intervalMs = 1000 / updatesPerSecond;

    const timer = setInterval(() => {
      // Cập nhật giá liên tục vào bộ nhớ ref, KHÔNG GỌI setState
      latestPricesRef.current = {
        t1: Math.max(0, latestPricesRef.current.t1 + (Math.random() * 5 - 2.5)),
        t2: Math.max(0, latestPricesRef.current.t2 + (Math.random() * 5 - 2.5)),
        t3: Math.max(0, latestPricesRef.current.t3 + (Math.random() * 5 - 2.5)),
      };
    }, intervalMs);

    return () => clearInterval(timer);
  }, [updatesPerSecond]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-3xl w-full flex flex-col items-center gap-10">
        
        <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <label htmlFor="frequency" className="text-sm font-semibold text-slate-700">
            Tần suất giả lập (lần/giây):
          </label>
          <input
            id="frequency"
            type="number"
            min="1"
            max="500"
            value={updatesPerSecond}
            onChange={(e) => setUpdatesPerSecond(Number(e.target.value))}
            className="w-24 px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-center"
          />
        </div>

        <div className="flex flex-row flex-wrap justify-center gap-6">
          {TICKETS_CONFIG.map((config) => (
            <Ticket 
              key={config.id} 
              config={config} 
              latestPricesRef={latestPricesRef} 
            />
          ))}
        </div>
        
      </div>
    </div>
  );
}