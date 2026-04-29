export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} border-2 border-white/10 border-t-cinema-red rounded-full animate-spin`} />
      {text && <p className="text-white/40 text-sm font-body">{text}</p>}
    </div>
  )
}