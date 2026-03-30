import React, { useState, useEffect, useContext } from "react";
import { MdOutlineStorefront, MdVisibility, MdDeleteOutline, MdOutlineHandyman } from "react-icons/md";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import PageWrapper from "../components/PageWrapper";

const Showcase = () => {
  const { currentUser } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [currentUser]);

  const fetchProducts = async () => {
    if (!currentUser) return;
    try {
      const q = query(
        collection(db, "products"),
        where("artisanId", "==", currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to permanently remove this piece from your catalog?")) {
      return;
    }
    
    try {
      const loadingToast = toast.loading("Removing masterpiece...");
      await deleteDoc(doc(db, "products", productId));
      
      setProducts(products.filter(p => p.id !== productId));
      toast.success("Piece safely removed from the marketplace.", { id: loadingToast });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to remove piece. Please try again.");
    }
  };

  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", description: "" });

  const handleEditClick = (product) => {
    setEditingProduct(product.id);
    setEditForm({ name: product.name, price: product.price, description: product.description });
  };

  const handleSaveEdit = async () => {
    const loadingToast = toast.loading("Updating masterpiece...");
    try {
      await updateDoc(doc(db, "products", editingProduct), {
        name: editForm.name,
        price: editForm.price,
        description: editForm.description
      });
      setProducts(products.map(p => p.id === editingProduct ? { ...p, ...editForm } : p));
      setEditingProduct(null);
      toast.success("Updated successfully.", { id: loadingToast });
    } catch (err) {
      toast.error("Failed to update product.", { id: loadingToast });
    }
  };

  return (
    <PageWrapper className="w-full bg-[#FAF7F2] min-h-[90vh] pb-24 px-4 md:px-8 py-10 overflow-hidden relative">
      
      {/* BACKGROUND ELEMENTS (Warm, earthy) */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-50/40 hidden lg:block" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        
        {/* EDITORIAL HEADER */}
        <div className="mb-14 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/50 border border-stone-300 mb-6">
              <MdOutlineStorefront className="text-stone-700" size={16} />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Digital Catalog</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-stone-900 font-display">
              My <span className="text-amber-600 italic">Showcase.</span>
            </h1>
            <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-xl">
              Curate, manage, and refine the masterpieces you present to the global marketplace. Ensure your authentic craft shines.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-5 min-w-[200px]">
             <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100">
                <MdOutlineHandyman size={28} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 mt-1">Listed Goods</p>
                <p className="text-2xl font-bold text-stone-800">{products.length} <span className="text-sm font-medium text-stone-400">active</span></p>
             </div>
          </div>
        </div>

        {/* CATALOG GRID */}
        {loading ? (
           <div className="flex justify-center flex-col items-center py-20 gap-4">
              <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-stone-500 italic font-medium">Unpacking your catalog...</p>
           </div>
        ) : products.length === 0 ? (
           <div className="bg-white rounded-[2rem] border border-dashed border-stone-300 p-16 text-center shadow-sm">
             <MdOutlineStorefront className="text-stone-300 mx-auto mb-4" size={48} />
             <h3 className="text-2xl font-display font-bold text-stone-800 mb-2">Empty Showcase</h3>
             <p className="text-stone-500 mb-6 font-medium">You have not listed any masterpieces on the marketplace yet.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="rounded-[2rem] border border-stone-200 p-4 hover:shadow-2xl transition-all duration-500 shadow-sm relative bg-white flex flex-col group overflow-hidden">
                
                {/* Delete Button */}
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="absolute p-3 bg-white/90 backdrop-blur-md top-6 right-6 text-red-500 hover:text-white hover:bg-red-500 rounded-full shadow-lg transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                  title="Remove from Marketplace"
                >
                   <MdDeleteOutline size={18} />
                </button>
                
                {/* Edit Button */}
                <button 
                  onClick={() => handleEditClick(product)}
                  className="absolute p-3 bg-white/90 backdrop-blur-md top-6 right-20 text-stone-600 hover:text-amber-600 hover:bg-amber-50 rounded-full shadow-lg transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                  title="Edit Product"
                >
                   <MdOutlineHandyman size={18} />
                </button>

                <div className="w-full h-64 bg-stone-100 rounded-2xl mb-5 overflow-hidden relative">
                   <img
                     src={product.imageUrl || "https://images.unsplash.com/photo-1610715936287-6c2ad208cdbf?auto=format&fit=crop&w=400&q=80"}
                     alt={product.name}
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent"></div>
                   <div className="absolute bottom-4 left-4 flex gap-2">
                       <span className="text-[11px] bg-white/20 backdrop-blur-md text-white border border-white/30 px-3 py-1.5 rounded-lg uppercase tracking-widest font-black shadow-sm">
                        ₹{product.price}
                      </span>
                   </div>
                </div>

                <div className="px-2 pb-2 flex-grow flex flex-col">
                    <h3 className="font-bold text-stone-900 line-clamp-1 text-xl mb-1.5">{product.name}</h3>
                    <p className="text-sm text-stone-500 line-clamp-2 mb-6 leading-relaxed font-medium">{product.description}</p>
    
                    <div className="flex justify-between items-center mt-auto pt-5 border-t border-stone-100 text-stone-500 text-sm">
                      <span className="flex items-center gap-1.5 font-bold bg-stone-50 text-stone-600 px-3 py-2 rounded-xl border border-stone-200 text-xs shadow-sm">
                        <MdVisibility size={16} /> {((product.id.charCodeAt(0) + product.id.charCodeAt(1)) % 40) + 10} Views
                      </span>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
      
      {/* Edit Form Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl relative">
            <h3 className="text-2xl font-bold font-display mb-6">Edit Listing</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-1">Name</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200" />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-1">Price (₹)</label>
                <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200" />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-1">Description</label>
                <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} rows={3} className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200 resize-none" />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setEditingProduct(null)} className="px-5 py-2 text-stone-500 font-bold hover:bg-stone-100 rounded-xl">Cancel</button>
                <button onClick={handleSaveEdit} className="px-5 py-2 bg-amber-500 text-stone-900 font-bold rounded-xl hover:bg-amber-400 shadow-lg shadow-amber-500/20">Save Updates</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </PageWrapper>
  );
};

export default Showcase;
