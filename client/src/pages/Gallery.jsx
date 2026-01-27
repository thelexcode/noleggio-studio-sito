import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const Gallery = () => {
    // Selection of images from the provided list
    const images = [
      '/images/S1.jpg', '/images/S2.jpg', '/images/S3.jpg', '/images/S4.jpg',
      '/images/S5.jpg', '/images/S6.jpg', '/images/S7.jpg', '/images/S8.jpg',
      '/images/R1.jpg', '/images/R2.jpg', '/images/REG1.jpg', '/images/REG2.jpg',
      '/images/E1.jpg', '/images/E2.jpg', '/images/U1.jpg', '/images/U2.jpg'
    ];
    const [selectedImg, setSelectedImg] = useState(null);

    return (
      <motion.div 
        initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} 
        className="pt-20 bg-surface min-h-screen" 
      >
          <div className="py-20 text-center">
            <h1 className="text-5xl font-serif font-bold text-accent mb-4">La Nostra <span className="text-primary">Galleria</span></h1>
            <p className="text-slate-500">Esplora i nostri spazi e le nostre produzioni.</p>
          </div>
          
          <div className="container mx-auto px-6 pb-24 text-center">
             <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 text-left">
                {images.map((img, i) => (
                    <motion.div 
                        key={i} 
                        layoutId={`img-${i}`}
                        onClick={() => setSelectedImg(img)}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="break-inside-avoid cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white relative group"
                    >
                        <img 
                            src={img} 
                            alt={`Gallery ${i}`} 
                            loading="lazy" 
                            className="w-full h-auto object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                             <ZoomIn className="text-white opacity-80" size={32} />
                        </div>
                    </motion.div>
                ))}
             </div>
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
