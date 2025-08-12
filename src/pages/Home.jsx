import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import HeroBanner from '../components/HeroBanner'
import CategorySection from '../components/CategorySection'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id, cat) => {
    console.log("working") // Fixed: console.log instead of console
    console.log(id, cat)
    
    // Find subcategory that belongs to this category
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id === id // Fixed: use === instead of ==
      })
      return filterData ? true : false // Fixed: explicit return
    })

    if (subcategory) {
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`
      navigate(url)
      console.log(url)
    } else {
      console.log("No subcategory found for category:", cat)
    }
  }

  return (
    <section className='bg-white min-h-screen'>
      {/* Category Navigation Section */}
      <CategorySection 
        loadingCategory={loadingCategory} 
        categoryData={categoryData} 
        subCategoryData={subCategoryData} 
        handleRedirectProductListpage={handleRedirectProductListpage} 
      />
      
      {/* Hero Banner Section */}
      <div className='container mx-auto px-4 mt-10'>
        <HeroBanner />
      </div>

      {/* Category-wise Product Display */}
      <div className='container mx-auto px-4 mt-8'>
        {categoryData?.map((category, index) => {
          return (
            <div key={category?._id + "CategorywiseProduct"} className="mb-8">
              <CategoryWiseProductDisplay
                id={category?._id}
                name={category?.name}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Home