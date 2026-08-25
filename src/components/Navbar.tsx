'use client';

export default function Navbar() {
  return (
    <header className="w-full bg-transparent border-b border-slate-200 no-print mb-6 pt-6 pb-4">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Brand section */}
          <div className="flex items-center gap-4">
            <img 
              src="/LOGO FOR.svg" 
              alt="For Healthcare Logo" 
              className="h-[64px] w-auto object-contain flex-none"
            />

            <div>
              <div className="font-extrabold text-[22px] text-[#0b3d66] tracking-tight leading-snug font-sans">
                FOR HEALTHCARE
              </div>
              <div className="font-semibold text-[11.5px] tracking-[1.6px] uppercase text-[#3f8f2f] mt-0.5">
                Care · Compassion · Trust
              </div>
              <div className="text-[11.5px] text-slate-600 mt-1 leading-tight">
                3rd, SUKRITHI # 1043, 2nd cross, main, BTM 4th Stage, Bilekahalli, Bengaluru, Karnataka 560076<br />
                +91 81975 26597 &nbsp;|&nbsp; +91 99640 05780 &nbsp;|&nbsp; forhealthcare.forlife@gmail.com
              </div>
            </div>
          </div>

          {/* Right title */}
          <div className="lg:text-right">
            <div className="text-[10.5px] font-bold uppercase tracking-[2px] text-slate-400">
              Nursing Home &amp; Home Healthcare
            </div>
            <h1 className="font-extrabold text-[22px] text-slate-900 mt-0.5 font-sans">
              Invoice / Bill Generator
            </h1>
          </div>

        </div>

      </div>
    </header>
  );
}
