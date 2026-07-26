import CategoryList from '@features/categories/components/CategoryList.jsx'

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-900">Categories</h1>
      <CategoryList />
    </div>
  )
}
