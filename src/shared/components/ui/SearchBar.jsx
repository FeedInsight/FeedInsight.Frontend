import { Search } from 'lucide-react'

const SearchBar = ({ onChange, value = '', placeholder = 'Search...' }) => {
  return (
    <div
      className={`flex items-center bg-white rounded-xl px-3 py-2 shadow-sm w-full max-w-xl `}>
      <Search className="w-5 h-5 text-slate-400 mr-2" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full outline-none text-sm text-slate-700 bg-transparent placeholder:text-slate-400"
      />
    </div>
  )
}

export default SearchBar