import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Trash2, Upload, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

const Gallery = () => {
    const { isAdmin } = useAuth();
    const [images, setImages] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.storage.from('gallery').list();
            
            if (error) throw error;
            
            const imageUrls = data
                .filter(file => file.name !== '.emptyFolderPlaceholder' && file.name)
                .map(file => {
                    const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(file.name);
                    return {
                        name: file.name,
                        url: publicUrl,
                        id: file.id
                    };
                });
                
            setImages(imageUrls);
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;

            setUploading(true);
            // Generate a unique filename to avoid collisions
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            await fetchImages();
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Errore durante il caricamento');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (fileName, e) => {
        e.stopPropagation(); // Prevent opening the image modal
        if (!window.confirm("Sei sicuro di voler eliminare questa immagine?")) return;
        
        try {
            const { error } = await supabase.storage
                .from('gallery')
                .remove([fileName]);
                
            if (error) throw error;
            
            await fetchImages();
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Errore durante l\'eliminazione');
        }
    };

    return (
      <motion.div 
        initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} 
        className="pt-20 bg-surface min-h-screen" 
      >
          <div className="py-20 text-center">
            <h1 className="text-5xl font-serif font-bold text-accent mb-4">La Nostra <span className="text-primary">Galleria</span></h1>
            <p className="text-slate-500 mb-8">Esplora i nostri spazi e le nostre produzioni.</p>
            
            {isAdmin && (
                <div className="flex justify-center mb-8">
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleUpload} 
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium shadow-md hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                        {uploading ? 'Caricamento in corso...' : 'Aggiungi Immagine'}
                    </button>
                </div>
            )}
          </div>
          
          <div className="container mx-auto px-6 pb-24 text-center">
             {loading ? (
                 <div className="flex justify-center items-center py-20">
                     <Loader2 className="animate-spin text-primary" size={48} />
                 </div>
             ) : images.length === 0 ? (
                 <div className="text-slate-500 py-10">
                     Nessuna immagine presente nella galleria.
                 </div>
             ) : (
                 <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 text-left">
                    {images.map((img) => (
                        <motion.div 
                            key={img.id || img.name} 
                            layoutId={`img-${img.name}`}
                            onClick={() => setSelectedImg(img.url)}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="break-inside-avoid cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white relative group"
                        >
                            <img 
                                src={img.url} 
                                alt={img.name} 
                                loading="lazy" 
                                className="w-full h-auto object-cover" 
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                 <ZoomIn className="text-white opacity-80" size={32} />
                            </div>
                            {isAdmin && (
                                <button 
                                    onClick={(e) => handleDelete(img.name, e)}
                                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-red-500 hover:text-white text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm"
                                    title="Elimina immagine"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </motion.div>
                    ))}
                 </div>
             )}
          </div>

          <AnimatePresence>
            {selectedImg && (
                <motion.div 
                    initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                    className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
                    onClick={() => setSelectedImg(null)}
                >
                    <button className="absolute top-8 right-8 text-slate-500 hover:text-accent transition-colors bg-white/50 hover:bg-white rounded-full p-2 z-[101] shadow-sm">
                        <X size={32} />
                    </button>
                    <motion.img 
                        src={selectedImg} 
                        initial={{scale: 0.9, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        exit={{scale: 0.9, opacity: 0}}
                        layoutId={`img-${selectedImg}`}
                        className="max-h-[85vh] max-w-full rounded-lg shadow-2xl object-contain bg-white" 
                        onClick={(e) => e.stopPropagation()}
                    />
                </motion.div>
            )}
          </AnimatePresence>
      </motion.div>
    );
}
export default Gallery;
