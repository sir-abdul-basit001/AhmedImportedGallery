export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-[#f8fafc] px-5 dark:bg-[#0d1117]">
      <div className="w-full max-w-sm text-center">
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#0b1f46] dark:border-[#30363d] dark:border-t-[#d4a72c]" />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0b1f46] text-2xl font-bold text-white shadow-lg dark:bg-[#d4a72c] dark:text-[#161b22]">
            A
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-wide text-[#0b1f46] dark:text-white">
          AHMED IMPORTED GALLERY
        </h1>

        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Preparing your shopping experience...
        </p>

        <div className="mx-auto mt-7 h-1.5 w-48 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div className="h-full w-1/2 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-[#d4a72c]" />
        </div>

        <p className="mt-5 text-xs tracking-wider text-gray-400">PLEASE WAIT</p>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}
