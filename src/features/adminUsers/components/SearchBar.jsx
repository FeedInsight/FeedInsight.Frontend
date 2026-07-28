const SearchBar = ({ onChange, value = '' }) => {
  return (
    <div className={`flex items-center bg-white rounded-xl px-3 py-2 shadow-sm w-full max-w-xl`}>
      <svg
        className="w-5 h-5 text-gray-400 mr-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
        ></path>
      </svg>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search by name, email, or company..."
        className="w-full outline-none text-sm text-gray-700 bg-transparent"
      />
    </div>
  )
}

export default SearchBar
