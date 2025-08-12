import React, { useState, useEffect } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const EditProductAdmin = ({ close ,data : propsData,fetchProductData}) => {
  const [data, setData] = useState({
    _id : propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {},
  })
  const [imageLoading, setImageLoading] = useState(false)
  const [ViewImageURL, setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory, setSelectCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")

  const [options, setOptions] = useState(propsData.options || []);
  const [optionName, setOptionName] = useState('');
  const [optionValue, setOptionValue] = useState('');
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(null);

  // Add option name
  const handleAddOption = () => {
    if (!optionName.trim()) return;
    setOptions([...options, { name: optionName.trim(), values: [] }]);
    setOptionName('');
  };
  // Add value to selected option
  const handleAddOptionValue = () => {
    if (selectedOptionIdx === null || !optionValue.trim()) return;
    setOptions(opts => opts.map((opt, idx) => idx === selectedOptionIdx ? { ...opt, values: [...opt.values, optionValue.trim()] } : opt));
    setOptionValue('');
  };
  // Remove option
  const handleRemoveOption = idx => setOptions(opts => opts.filter((_, i) => i !== idx));
  // Remove value from option
  const handleRemoveOptionValue = (optIdx, valIdx) => setOptions(opts => opts.map((opt, i) => i === optIdx ? { ...opt, values: opt.values.filter((_, vi) => vi !== valIdx) } : opt));


  const handleChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]

    if (!file) {
      return
    }
    setImageLoading(true)
    const response = await uploadImage(file)
    const { data: ImageResponse } = response
    const imageUrl = ImageResponse.data.url

    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl]
      }
    })
    setImageLoading(false)

  }

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }
  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleAddField = () => {
    setData((preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: ""
        }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("data", data)

    try {
      const submitData = { ...data, options };
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: submitData
      })
      const { data: responseData } = response

      if (responseData.success) {
        successAlert(responseData.message)
        if(close){
          close()
        }
        fetchProductData()
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        })
        setOptions([]);
      }
    } catch (error) {
      AxiosToastError(error)
    }


  }

  return (
    <section className='fixed top-0 right-0 left-0 bottom-0 bg-black z-50 bg-opacity-70 p-4'>
      <div className='bg-white w-full p-4 max-w-2xl mx-auto rounded overflow-y-auto h-full max-h-[95vh]'>
        <section className=''>
          <div className='p-2   bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Upload Product</h2>
            <button onClick={close}>
              <IoClose size={20}/>
            </button>
          </div>
          <div className='grid p-3'>
            <form className='grid gap-4' onSubmit={handleSubmit}>
              <div className='grid gap-1'>
                <label htmlFor='name' className='font-medium'>Name</label>
                <input
                  id='name'
                  type='text'
                  placeholder='Enter product name'
                  name='name'
                  value={data.name}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>
              <div className='grid gap-1'>
                <label htmlFor='description' className='font-medium'>Description</label>
                <textarea
                  id='description'
                  type='text'
                  placeholder='Enter product description'
                  name='description'
                  value={data.description}
                  onChange={handleChange}
                  required
                  multiple
                  rows={3}
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none'
                />
              </div>
              <div>
                <p className='font-medium'>Image</p>
                <div>
                  <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                    <div className='text-center flex justify-center items-center flex-col'>
                      {
                        imageLoading ? <Loading /> : (
                          <>
                            <FaCloudUploadAlt size={35} />
                            <p>Upload Image</p>
                          </>
                        )
                      }
                    </div>
                    <input
                      type='file'
                      id='productImage'
                      className='hidden'
                      accept='image/*'
                      onChange={handleUploadImage}
                    />
                  </label>
                  {/**display uploded image*/}
                  <div className='flex flex-wrap gap-4'>
                    {
                      data.image.map((img, index) => {
                        return (
                          <div key={img + index} className='h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group'>
                            <img
                              src={img}
                              alt={img}
                              className='w-full h-full object-scale-down cursor-pointer'
                              onClick={() => setViewImageURL(img)}
                            />
                            <div onClick={() => handleDeleteImage(index)} className='absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer'>
                              <MdDelete />
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>

              </div>
              <div className='grid gap-1'>
                <label className='font-medium'>Category</label>
                <div>
                  <select
                    className='bg-blue-50 border w-full p-2 rounded'
                    value={selectCategory}
                    onChange={(e) => {
                      const value = e.target.value
                      const category = allCategory.find(el => el._id === value)

                      setData((preve) => {
                        return {
                          ...preve,
                          category: [...preve.category, category],
                        }
                      })
                      setSelectCategory("")
                    }}
                  >
                    <option value={""}>Select Category</option>
                    {
                      allCategory.map((c, index) => {
                        return (
                          <option value={c?._id}>{c.name}</option>
                        )
                      })
                    }
                  </select>
                  <div className='flex flex-wrap gap-3'>
                    {
                      data.category.map((c, index) => {
                        return (
                          <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                            <p>{c.name}</p>
                            <div className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveCategory(index)}>
                              <IoClose size={20} />
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
              <div className='grid gap-1'>
                <label className='font-medium'>Sub Category</label>
                <div>
                  <select
                    className='bg-blue-50 border w-full p-2 rounded'
                    value={selectSubCategory}
                    onChange={(e) => {
                      const value = e.target.value
                      const subCategory = allSubCategory.find(el => el._id === value)

                      setData((preve) => {
                        return {
                          ...preve,
                          subCategory: [...preve.subCategory, subCategory]
                        }
                      })
                      setSelectSubCategory("")
                    }}
                  >
                    <option value={""} className='text-neutral-600'>Select Sub Category</option>
                    {
                      allSubCategory.map((c, index) => {
                        return (
                          <option value={c?._id}>{c.name}</option>
                        )
                      })
                    }
                  </select>
                  <div className='flex flex-wrap gap-3'>
                    {
                      data.subCategory.map((c, index) => {
                        return (
                          <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                            <p>{c.name}</p>
                            <div className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveSubCategory(index)}>
                              <IoClose size={20} />
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>

              <div className='grid gap-1'>
                <label htmlFor='unit' className='font-medium'>Unit</label>
                <input
                  id='unit'
                  type='text'
                  placeholder='Enter product unit'
                  name='unit'
                  value={data.unit}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>

              <div className='grid gap-1'>
                <label htmlFor='stock' className='font-medium'>Number of Stock</label>
                <input
                  id='stock'
                  type='number'
                  placeholder='Enter product stock'
                  name='stock'
                  value={data.stock}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>

              <div className='grid gap-1'>
                <label htmlFor='price' className='font-medium'>Price</label>
                <input
                  id='price'
                  type='number'
                  placeholder='Enter product price'
                  name='price'
                  value={data.price}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>

              <div className='grid gap-1'>
                <label htmlFor='discount' className='font-medium'>Discount</label>
                <input
                  id='discount'
                  type='number'
                  placeholder='Enter product discount'
                  name='discount'
                  value={data.discount}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>


              {/* Specifications Table */}
              <div className="grid gap-1">
                <label className="font-medium">Specifications</label>
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-left text-xs sm:text-sm bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-2 border-b font-semibold">Name</th>
                        <th className="py-2 px-2 border-b font-semibold">Value</th>
                        <th className="py-2 px-2 border-b font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(data.more_details || {}).map(([k, v], idx) => (
                        <tr key={k + idx}>
                          <td className="py-1 px-2 border-b">
                            <input
                              type="text"
                              value={k}
                              onChange={e => {
                                const newKey = e.target.value;
                                setData(prev => {
                                  const newDetails = { ...prev.more_details };
                                  const value = newDetails[k];
                                  delete newDetails[k];
                                  newDetails[newKey] = value;
                                  return { ...prev, more_details: newDetails };
                                });
                              }}
                              className="bg-blue-50 p-1 border rounded w-full"
                              required
                            />
                          </td>
                          <td className="py-1 px-2 border-b">
                            <input
                              type="text"
                              value={v}
                              onChange={e => {
                                const value = e.target.value;
                                setData(prev => ({
                                  ...prev,
                                  more_details: { ...prev.more_details, [k]: value }
                                }));
                              }}
                              className="bg-blue-50 p-1 border rounded w-full"
                              required
                            />
                          </td>
                          <td className="py-1 px-2 border-b">
                            <button
                              type="button"
                              className="text-red-600 font-bold px-2"
                              onClick={() => {
                                setData(prev => {
                                  const newDetails = { ...prev.more_details };
                                  delete newDetails[k];
                                  return { ...prev, more_details: newDetails };
                                });
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  className="mt-2 bg-primary-100 hover:bg-primary-200 py-1 px-3 rounded font-semibold text-xs sm:text-sm"
                  onClick={() => {
                    // Add a new empty row with a unique key
                    let i = 1;
                    let newKey = `Specification ${i}`;
                    while (data.more_details && data.more_details[newKey]) {
                      i++;
                      newKey = `Specification ${i}`;
                    }
                    setData(prev => ({
                      ...prev,
                      more_details: { ...prev.more_details, [newKey]: '' }
                    }));
                  }}
                >
                  + Add Specification
                </button>
              </div>

              {/* Product Options Section */}
              <div className="grid gap-1">
                <label className="font-medium">Product Options (e.g., Size, RAM, Color)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Option Name (e.g., Size, RAM)"
                    value={optionName}
                    onChange={e => setOptionName(e.target.value)}
                    className="bg-blue-50 p-1 border rounded w-40"
                  />
                  <button type="button" className="bg-green-600 text-white px-2 rounded" onClick={handleAddOption}>Add Option</button>
                </div>
                {options.map((opt, idx) => (
                  <div key={idx} className="mb-2 border rounded p-2 bg-blue-50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{opt.name}</span>
                      <button type="button" className="text-red-600 text-xs" onClick={() => handleRemoveOption(idx)}>Remove</button>
                    </div>
                    <div className="flex gap-2 mb-1">
                      <input
                        type="text"
                        placeholder={`Add value to ${opt.name}`}
                        value={selectedOptionIdx === idx ? optionValue : ''}
                        onChange={e => { setSelectedOptionIdx(idx); setOptionValue(e.target.value); }}
                        className="bg-white p-1 border rounded w-32"
                      />
                      <button type="button" className="bg-blue-600 text-white px-2 rounded" onClick={handleAddOptionValue}>Add Value</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {opt.values.map((val, vIdx) => (
                        <span key={vIdx} className="bg-white border px-2 py-1 rounded flex items-center gap-1">
                          {val}
                          <button type="button" className="text-xs text-red-500" onClick={() => handleRemoveOptionValue(idx, vIdx)}>&times;</button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div onClick={() => setOpenAddField(true)} className=' hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded'>
                Add Fields
              </div>

              <button
                className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold'
              >
                Update Product
              </button>
            </form>
          </div>

          {
            ViewImageURL && (
              <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />
            )
          }

          {
            openAddField && (
              <AddFieldComponent
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                submit={handleAddField}
                close={() => setOpenAddField(false)}
              />
            )
          }
        </section>
      </div>
    </section>
  )
}

export default EditProductAdmin


