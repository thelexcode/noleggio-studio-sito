import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Edit, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import EditContentModal from '../components/EditContentModal';

const initialServicesData = [
    { 
        title: 'Noleggio Studio', 
        desc: 'Spazio insonorizzato e climatizzato, ideale per registrazioni video e shooting. Dotato di green screen, fondali colorati e limbo bianco.', 
        img: '/images/S3.jpg',
        features: ['Green Screen', 'Limbo 6x6m', 'Luci abinabili', 'Camerini']
    },
    { 
        title: 'Regia Mobile & Fissa', 
        desc: 'Sistemi di regia completi per gestire produzioni multicamera sia in studio che in esterna. Tecnologie 4K e workflow SDI.', 
        img: '/images/REG1.jpg',
        features: ['Mixer Video 4K', 'Regia Audio Digitale', 'Intercom', 'Replay System']
    },
    { 
        title: 'Personale Tecnico', 
        desc: 'Un team di professionisti pronti a supportarti. Registi, cameraman, fonici, direttori della fotografia e tecnici luci.', 
        img: '/images/R2.jpg',
        features: ['Registi', 'DOP', 'Cameraman', 'Fonici']
    },
    { 
        title: 'Live Streaming', 
        desc: 'Porta il tuo evento ovunque. Servizi di streaming professionale su tutte le piattaforme con encoding hardware ridondato.', 
        img: '/images/U1.jpg',
        features: ['Multi-platform', 'Backup 4G/5G', 'Grafica Live', 'Interazione Social']
    },
    { 
        title: 'Post-Produzione', 
        desc: 'Diamo il tocco finale al tuo video. Montaggio, color correction, sound design e motion graphics di alto livello.', 
        img: '/images/E4.jpg',
        features: ['Editing 4K', 'Color Grade', 'VFX', 'Mixaggio Audio']
    },
    { 
        title: 'Eventi Aziendali', 
        desc: 'Supporto tecnico completo per convention, webinar, meeting e lanci di prodotto. Trasformiamo eventi in show televisivi.', 
        img: '/images/E2.jpg',
        features: ['Proiezione', 'Allestimento Stage', 'Audio Sala', 'Diretta Video']
    }
];

const Services = () => {
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    
    // Content State
    const [content, setContent] = useState({
        page_title: 'I Nostri Servizi',
        page_subtitle: 'Dalla ripresa alla post-produzione, offriamo un ecosistema completo per il video.',
        services_list: initialServicesData
    });

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null); // { key: 'page_title', label: 'Titolo Pagina', value: '...', type: 'text' }

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('site_content')
                .select('*')
                .eq('section', 'services');

            if (error) {
                console.error('Error fetching content:', error);
                return;
            }

            if (data && data.length > 0) {
                const newContent = { ...content };
                data.forEach(item => {
                    // Only update if key exists in our initial structure or we want everything
                    // For safety, we trust the DB keys
                    if (item.type === 'json') {
                         try {
                            // If it's a string, parse it. Supersbase sometimes returns object automatically if column is jsonb?
                            // supabase-js returns jsonb columns as objects automatically.
                            // BUT if I inserted it as a stringified json in the SQL script, it might depend.
                            // The SQL script used: value jsonb not null.
                            // Insert query used: '... [ ... ] ...'
                            // Supabase JS client usually returns the object directly for jsonb columns.
                            newContent[item.key] = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
                         } catch (e) {
                             console.error("Error parsing JSON for key", item.key, e);
                         }
                    } else {
                        newContent[item.key] = item.value;
                    }
                });
                setContent(newContent);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (key, label, type = 'text') => {
        let value = content[key];
        // prepare value for editing (if json object -> stringify)
        if (type === 'json') {
            value = JSON.stringify(value, null, 2);
        }
        setEditingItem({ key, label, value, type });
        setModalOpen(true);
    };

    const handleSave = async (key, newValue) => {
        try {
            // Optimistic update
            let valueToStore = newValue;
            if (editingItem.type === 'json') {
                valueToStore = JSON.parse(newValue);
            }

            setContent(prev => ({
                ...prev,
                [key]: valueToStore
            }));

            // If it's JSON, we need to make sure we send valid JSON to Supabase
            // Supabase expects an object/array for jsonb, NOT a stringified string unless we want a string.
            
            const { error } = await supabase
                .from('site_content')
                .upsert({ 
                    section: 'services',
                    key: key, 
                    value: valueToStore,
                    updated_at: new Date()
                }, { onConflict: 'key' });

            if (error) throw error;

            console.log('Saved successfully');
        } catch (err) {
            console.error("Error saving to DB:", err);
            throw err;
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="pt-20 relative"
        >
            {/* Edit Modal */}
            <EditContentModal 
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                contentKey={editingItem?.key}
                initialValue={editingItem?.value}
                label={editingItem?.label}
                type={editingItem?.type}
            />

            {isAdmin && (
                <div className="fixed top-24 right-6 z-40 bg-accent text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse cursor-pointer hover:bg-accent/90 transition-colors"
                    onClick={() => handleEdit('services_list', 'Lista Servizi', 'json')}
                >
                    <Edit size={16} /> Admin Mode Active
                </div>
            )}

            <div className="bg-surface py-24 relative group/header">
                <div className="container mx-auto px-6 text-center">
                    <div className="relative inline-block">
                            {content.page_title}
                        {isAdmin && (
                            <button 
                                onClick={() => handleEdit('page_title', 'Titolo Pagina', 'text')}
                                className="absolute -right-12 top-0 p-2 text-primary hover:bg-primary/10 rounded-full transition-colors opacity-0 group-hover/header:opacity-100"
                            >
                                <Edit size={20} />
                            </button>
                        )}
                    </div>
                    
                    <div className="relative max-w-2xl mx-auto group/desc">
                            {content.page_subtitle}
                        {isAdmin && (
                            <button 
                                onClick={() => handleEdit('page_subtitle', 'Sottotitolo Pagina', 'textarea')}
                                className="absolute -right-12 top-0 p-2 text-primary hover:bg-primary/10 rounded-full transition-colors opacity-0 group-hover/desc:opacity-100"
                            >
                                <Edit size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-24">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                         <Loader2 className="animate-spin text-primary" size={48} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative group/list">
                        {/* Admin Edit Trigger for the whole list */}
                        {isAdmin && (
                            <div className="absolute -top-12 right-0">
                                <button 
                                    onClick={() => handleEdit('services_list', 'Lista Servizi', 'json')}
                                    className="flex items-center gap-2 text-sm font-medium text-primary hover:underline bg-white px-3 py-1 rounded shadow-sm border border-primary/20"
                                >
                                    <Edit size={16} /> Modifica Griglia Servizi (JSON)
                                </button>
                            </div>
                        )}

                        {Array.isArray(content.services_list) && content.services_list.map((service, index) => (
                            <motion.div 
                                key={index}
                                className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full group"
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <motion.img 
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.5 }}
                                        src={service.img} 
                                        alt={service.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                        <span className="text-white font-medium flex items-center gap-2">Scopri di più <ArrowRight size={16}/></span>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-serif font-bold mb-4 text-accent">{service.title}</h3>
                                    <p className="text-slate-600 mb-8 flex-1 leading-relaxed">{service.desc}</p>
                                    <div className="mt-auto">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Caratteristiche</h4>
                                        <ul className="grid grid-cols-2 gap-3">
                                            {service.features && service.features.map((f, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                                    <Check size={16} className="text-primary" /> {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Services;
