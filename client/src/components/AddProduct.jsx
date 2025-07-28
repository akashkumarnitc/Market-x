import React, {useState} from 'react'
import Layout from './Layout'

import axiosInstance from '../api/axiosInstance';

function AddProduct() {
  const [form,setForm]= useState({
    name:"",
    description:"",
    price:"",
    category:"",
    image:null,
  });

  const[loading,setLoading]=useState(false);
  const[message,setMessage]=useState("");
  //handle text input changes
  const handleChange =(e)=>{
    const {name,value}=e.target
    setForm((prev)=>({
      ...prev,
      [name]:value,
    }))
  }
  // to handle image file change
  const handleImageChange =(e)=>{
    setForm((prev)=>({
      ...prev,
      image:e.target.files[0],
    }))
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("name",form.name);
    formData.append("description",form.description);
    formData.append("price",form.price);
    formData.append("category",form.category);
    formData.append("file",form.image);

    try {
      const token = localStorage.getItem("token"); //assumed token is stored after login
      const res = await axiosInstance.post(
        "/product/create",
        formData,
        {
          headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"multipart/form-data",
          },
        }
      )
      setMessage(res.data.message || "Product created successfully");
      setForm({name:"",description:"",price:"",category:"",image:null});
    } catch (error) {
      setMessage(
        error.response?.data?.message ||"Something went wrong while creating product"
      )
      
    }finally{
      setLoading(false);
    }
  }
  return (
    <>
      <Layout>
        <div className="max-w-xl mx-auto mt-10 bg-white border shadow-md rounded-lg p-6">
          <h2 className="text-2xl text-black font-semibold mb-4">Add New Product</h2>
          
        {message && (
          <div className="mb-4 text-center text-sm text-blue-600">{message}</div>
        )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-black font-medium">Product Name</label>
              <input 
              type="text" 
              name="name" 
              value={form.name}
              onChange={handleChange}
              className="w-full text-black border rounded px-3 py-2" 
              placeholder="Enter product name"
              required
               />
            </div>
            <div>
              <label className="block mb-1 text-black font-medium">Description</label>
              <textarea 
              name="description" 
              value={form.description}
              onChange={handleChange}

              className="w-full border text-black rounded px-3 py-2" 
              rows="4" 
              placeholder="Describe your product..."
              required
              ></textarea>
            </div>
            <div>
              <label className="block mb-1 text-black font-medium">Price (₹)</label>
              <input 
              type="number" 
              name="price"
              value={form.price}
              onChange={handleChange} 
              className="w-full border rounded px-3 py-2 text-black" placeholder="0"
              required
               />
              
            </div>
            <div>
              <label className="block mb-1 text-black font-medium">Category</label>
              <select 
              name="category" 
              value={form.category}
              onChange={handleChange}
              className="w-full border text-black rounded px-3 py-2"
              required
              >
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="books">Books</option>
                <option value="furniture">Furniture</option>
                <option value="fashion">Fashion</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-black font-medium">Upload Image</label>
              <input 
              type="file" 
              name="image"
              accept='image/*' 
              onChange={handleImageChange}
              className="w-full border rounded text-black px-3 py-2" 
              required
              />
            </div>
            {form.image && (
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="Preview"
                    className="w-full h-auto my-2 rounded"
                  />
             )}
            <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
            >
              {loading ? "Uploading...":"Submit"}</button>
          </form>
        </div>
      </Layout>
    </>
  )
}

export default AddProduct