import { motion } from 'framer-motion';
import { ArrowRight, Video, Mic, Globe, CheckCircle, Star, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditContentModal from '../components/EditContentModal';
import { useContent } from '../hooks/useContent';

const initialContent = {
    hero_badge: 'PROFESSIONAL BROADCAST SERVICES',
    hero_title: 'Lo Spazio per la Tua Produzione',
    hero_desc: 'Studi televisivi premium con attrezzature all\'avanguardia. Regia, streaming e supporto tecnico per elevare i tuoi contenuti.',
    features_title: 'Eccellenza Tecnica',
    features_desc: 'Ogni dettaglio è stato pensato per offrire la massima qualità produttiva.',
    features_list: [
        { title: 'Studi Attrezzati', desc: 'Set modulari con illuminazione broadcast e limbo/green screen.' },
        { title: 'Regia A/V', desc: 'Regie tricaster 4K, mixer audio digitali e workflow SDI.' },
        { title: 'Live Streaming', desc: 'Connettività in fibra dedicata ridondata per dirette stabili.' }
    ],
    why_us_badge: 'Perché Noi',
    why_us_title: 'Standard Televisivi, Flessibilità Digitale.',
    why_us_desc: 'Non offriamo solo uno spazio, ma un partner tecnico per la tua produzione. Dall\'idea alla messa in onda, ti supportiamo con esperienza decennale.',
    why_us_list: [
        'Tecnologie 4K Ready', 
        'Personale Certificato', 
        'Privacy e Sicurezza', 
        'Location Premium a Milano'
    ]
};

const Home = () => {
    const { 
        content, loading: contentLoading, isAdmin, modalOpen, setModalOpen, editingItem, handleEdit, handleEditItem, handleSave 
    } = useContent('home', initialContent);

    // Helper to render icon for dynamic list (since icon name is string in DB but component in frontend)
    // For now we map index to icons or use switch based on stored string if we stored it? 
    // The initial content has implicit order.
    const featureIcons = [Video, Mic, Globe];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-background relative"
        >
            <EditContentModal 
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                contentKey={editingItem?.key || 'edit'}
                initialValue={editingItem?.value}
                label={editingItem?.label}
                type={editingItem?.inputType}
            />

            {isAdmin && (
                <div className="fixed top-24 right-6 z-40 bg-accent text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse pointer-events-none opacity-80">
                    <Edit size={16} /> Admin Mode
                </div>
            )}

            {/* Hero Section */}
            <section className="relative h-screen min-h-[700px] flex items-center justify-center bg-cover bg-center bg-fixed group" style={{ backgroundImage: "url('/images/S1.jpg')" }}>
                {/* Lighter overlay for contrast but keeping brightness */}
                <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                
                <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
                    <div className="relative inline-block mb-6">
                        <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium tracking-wider"
                        >
                            {content.hero_badge}
                        </motion.span>
                        {isAdmin && <button onClick={() => handleEdit('hero_badge', 'Badge Hero', 'text')} className="absolute -right-8 top-0 text-white/50 hover:text-white"><Edit size={16}/></button>}
                    </div>

                    <div className="relative">
                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-white mb-8 leading-tight"
                        >
                            {content.hero_title}
                        </motion.h1>
                        {isAdmin && <button onClick={() => handleEdit('hero_title', 'Titolo Hero', 'textarea')} className="absolute top-0 right-0 text-white/50 hover:text-white p-2"><Edit size={24}/></button>}
                    </div>

                    <div className="relative max-w-2xl mx-auto">
                        <motion.p
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-xl text-slate-200 mb-12 font-light leading-relaxed"
                        >
                            {content.hero_desc}
                        </motion.p>
                        {isAdmin && <button onClick={() => handleEdit('hero_desc', 'Descrizione Hero', 'textarea')} className="absolute top-0 -right-8 text-white/50 hover:text-white"><Edit size={20}/></button>}
                    </div>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link to="/servizi" className="px-8 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors">
                            Esplora Servizi
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features / Services Preview */}
            <section className="py-32 bg-surface">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20 relative group/features-header">
                        <div className="relative inline-block">
                            <h2 className="section-title mb-6">{content.features_title}</h2>
                            {isAdmin && <button onClick={() => handleEdit('features_title', 'Titolo Features', 'text')} className="absolute -right-8 top-0 text-primary opacity-0 group-hover/features-header:opacity-100"><Edit size={16}/></button>}
                        </div>
                        <div className="relative max-w-2xl mx-auto">
                            <p className="text-slate-600 text-lg">{content.features_desc}</p>
                            {isAdmin && <button onClick={() => handleEdit('features_desc', 'Descrizione Features', 'textarea')} className="absolute -right-8 top-0 text-primary opacity-0 group-hover/features-header:opacity-100"><Edit size={16}/></button>}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {content.features_list && content.features_list.map((item, idx) => {
                            const Icon = featureIcons[idx] || Video;
                            return (
                                <motion.div 
                                    key={idx}
                                    className="bg-white p-10 rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 border border-slate-100 group relative"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                                        <Icon size={32} />
                                    </div>
                                    <div className="relative mb-4">
                                         <h3 className="text-2xl font-serif font-bold text-accent">{item.title}</h3>
                                         {isAdmin && <button onClick={() => handleEditItem('features_list', idx, 'title', `Titolo Feature ${idx+1}`, 'text')} className="absolute right-0 top-0 text-primary opacity-0 group-hover:opacity-100"><Edit size={16}/></button>}
                                    </div>
                                    <div className="relative">
                                        <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                                        {isAdmin && <button onClick={() => handleEditItem('features_list', idx, 'desc', `Descrizione Feature ${idx+1}`, 'textarea')} className="absolute right-0 top-0 text-primary opacity-0 group-hover:opacity-100"><Edit size={16}/></button>}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

             {/* Why Choose Us */}
             <section className="py-32 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative group/why">
                             <div className="relative inline-block">
                                <span className="text-primary font-bold tracking-wider uppercase text-sm">{content.why_us_badge}</span>
                                {isAdmin && <button onClick={() => handleEdit('why_us_badge', 'Badge Perché Noi', 'text')} className="ml-2 text-primary opacity-0 group-hover/why:opacity-100"><Edit size={14}/></button>}
                             </div>
                             
                             <div className="relative">
                                 <h2 className="text-5xl font-serif font-medium mt-4 mb-8 text-accent leading-tight">
                                     {content.why_us_title}
                                 </h2>
                                 {isAdmin && <button onClick={() => handleEdit('why_us_title', 'Titolo Perché Noi', 'textarea')} className="absolute top-0 right-0 text-primary opacity-0 group-hover/why:opacity-100"><Edit size={20}/></button>}
                             </div>

                             <div className="relative">
                                 <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                                     {content.why_us_desc}
                                 </p>
                                 {isAdmin && <button onClick={() => handleEdit('why_us_desc', 'Descrizione Perché Noi', 'textarea')} className="absolute top-0 right-0 text-primary opacity-0 group-hover/why:opacity-100"><Edit size={16}/></button>}
                             </div>
                             
                             <ul className="space-y-6">
                                {content.why_us_list && content.why_us_list.map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-lg text-slate-700 relative group/li">
                                        <div className="p-1 rounded-full bg-green-100 text-green-600"><CheckCircle size={18} /></div> 
                                        <span>{item}</span>
                                        {isAdmin && <button onClick={() => handleEditItem('why_us_list', i, null, `Punto ${i+1}`, 'text')} className="ml-2 text-primary opacity-0 group-hover/li:opacity-100"><Edit size={14}/></button>}
                                    </li>
                                ))}
                             </ul>
                             <Link to="/chi-siamo" className="btn mt-12 bg-accent hover:bg-slate-800">Il Nostro Team</Link>
                        </div>
                        <div className="relative">
                            <motion.div 
                                className="absolute -inset-4 bg-primary/10 rounded-3xl -z-10"
                                animate={{ rotate: [0, 5, 0] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <img src="/images/R1.jpg" alt="Regia" className="rounded-2xl shadow-2xl w-full" />
                            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-xl shadow-xl flex items-center gap-4 max-w-xs animate-bounce-slow">
                                <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                                    <Star size={24} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="font-bold text-accent">Qualità Garantita</p>
                                    <p className="text-xs text-slate-500">10+ Anni di Esperienza</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </section>
        </motion.div>
    );
}

export default Home;
