import { Search } from 'lucide-react'

const SearchBar = ({ onChange, value = '', placeholder = 'Search...' }) => {
  return (
    <div className="flex w-full max-w-xl items-center rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 shadow-sm transition-all focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 dark:border-slate-600 dark:bg-slate-900 dark:focus-within:border-brand-400 dark:focus-within:ring-brand-400/20">
      <Search className="mr-2.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-400"
      />
    </div>
  )
}

export default SearchBar
