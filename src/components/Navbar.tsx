'use client';

export default function Navbar() {
  return (
    <header className="w-full bg-transparent border-b border-slate-200 no-print mb-4 sm:mb-6 pt-4 sm:pt-6 pb-4">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          
          {/* Brand section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <img 
              src="/LOGO FOR.svg" 
              alt="For Healthcare Logo" 
              className="h-12 sm:h-16 w-auto object-contain flex-none"
            />

            <div>
              <div className="font-extrabold text-lg sm:text-[22px] text-[#0b3d66] tracking-tight leading-snug font-sans">
                FOR HEALTHCARE
              </div>
              <div className="font-semibold text-[10.5px] sm:text-[11.5px] tracking-[1.6px] uppercase text-[#3f8f2f] mt-0.5">
                Care · Compassion · Trust
              </div>
              <div className="text-[10.5px] sm:text-[11.5px] text-slate-600 mt-1 leading-tight max-w-xl">
                3rd, SUKRITHI # 1043, 2nd cross, main, BTM 4th Stage, Bilekahalli, Bengaluru, Karnataka 560076<br />
                <span className="inline-block mt-0.5">
                  +91 81975 26597 &nbsp;|&nbsp; +91 99640 05780 &nbsp;|&nbsp; forhealthcare.forlife@gmail.com
                </span>
              </div>
            </div>
          </div>

          {/* Right title */}
          <div className="md:text-right mt-2 md:mt-0">
            <div className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[2px] text-slate-400">
              Nursing Home &amp; Home Healthcare
            </div>
            <h1 className="font-extrabold text-lg sm:text-[22px] text-slate-900 mt-0.5 font-sans">
              Invoice / Bill Generator
            </h1>
          </div>

        </div>

      </div>
    </header>
  );
}
