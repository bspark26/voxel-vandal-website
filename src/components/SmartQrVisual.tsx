const QrMark = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 84 84" role="img" aria-label="Decorative QR code preview">
    <rect width="84" height="84" rx="5" fill="#F7FAF7" />
    <g fill="#09100B">
      <path d="M8 8h24v24H8zm5 5v14h14V13zM52 8h24v24H52zm5 5v14h14V13zM8 52h24v24H8zm5 5v14h14V57z" />
      <path d="M38 8h7v7h-7zM38 20h7v13h-7zM32 38h7v7h-7zM44 32h7v7h-7zM56 38h7v7h-7zM68 38h8v8h-8zM8 38h13v7H8zM20 44h7v7h-7zM38 50h7v7h-7zM50 50h13v7H50zM68 52h8v13h-8zM38 62h13v7H38zM56 62h7v14h-7zM68 70h8v6h-8zM44 42h7v7h-7z" />
    </g>
    <rect x="39" y="39" width="8" height="8" rx="2" fill="#35B84A" />
  </svg>
);

export default function SmartQrVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative mx-auto w-full ${compact ? "max-w-xl" : "max-w-2xl"}`} aria-hidden="true">
      <div className="absolute inset-12 rounded-full bg-brand/15 blur-[90px] animate-pulse-soft" />
      <div className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#0c100d] p-4 shadow-2xl shadow-black/40 sm:p-7">
        <div className="grid-surface absolute inset-0 opacity-55" />
        <div className="relative flex items-center justify-between border-b border-white/8 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_14px_rgba(53,184,74,.8)]" />
            <span className="text-[10px] font-semibold tracking-[0.18em] text-zinc-400 uppercase">Smart display · Active</span>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] text-zinc-400">VV–001</span>
        </div>

        <div className="relative grid min-h-[320px] items-center gap-6 py-7 sm:grid-cols-[0.85fr_1.15fr]">
          <div className="relative mx-auto w-[190px] sm:w-full sm:max-w-[220px]">
            <div className="absolute -inset-3 rounded-[1.4rem] border border-brand/15 bg-brand/5 blur-sm" />
            <div className="relative rounded-[1.2rem] border border-white/12 bg-[#171c18] p-4 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[8px] font-bold tracking-[0.18em] text-brand uppercase">Property access</span>
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              </div>
              <QrMark className="w-full rounded-lg" />
              <div className="mt-4">
                <p className="text-xs font-semibold text-white">Scan for property details</p>
                <p className="mt-1 text-[9px] text-zinc-500">Powered by Voxel Vandal</p>
              </div>
            </div>
            <div className="mx-auto h-7 w-20 border-x border-white/10 bg-[#111612]" />
            <div className="mx-auto h-2 w-32 rounded-full border border-white/10 bg-[#171c18]" />
          </div>

          <div className="rounded-xl border border-white/10 bg-[#111612]/95 p-4 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[9px] tracking-[0.16em] text-zinc-500 uppercase">Destination</p>
                <p className="mt-1 text-xs font-semibold text-white">Listing link</p>
              </div>
              <span className="rounded-md bg-brand/10 px-2 py-1 text-[9px] font-semibold text-brand">Live</span>
            </div>
            <div className="rounded-lg border border-white/8 bg-black/25 p-3">
              <p className="truncate text-[10px] text-zinc-400">youragency.com/listings/127</p>
            </div>
            <div className="my-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/8" />
              <span className="text-[9px] text-zinc-600">UPDATE TO</span>
              <span className="h-px flex-1 bg-white/8" />
            </div>
            <div className="rounded-lg border border-brand/25 bg-brand/5 p-3">
              <p className="truncate text-[10px] text-brand">youragency.com/open-house</p>
            </div>
            <div className="mt-4 rounded-lg bg-brand py-2.5 text-center text-[10px] font-bold text-[#061008]">Save new destination</div>
          </div>
        </div>

        <div className="relative flex items-center justify-between border-t border-white/8 pt-4 text-[9px] text-zinc-500">
          <span>Physical code remains unchanged</span>
          <span className="text-brand">Manage remotely →</span>
        </div>
      </div>
    </div>
  );
}
