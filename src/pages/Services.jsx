import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Edit, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import EditContentModal from '../components/EditContentModal';
import SEO from '../components/SEO';

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
    const { isAdmin, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    
    // Content State
    const [content, setContent] = useState({
        page_title: 'I Nostri Servizi',
        page_subtitle: 'Dalla ripresa alla post-produzione, offriamo un ecosistema completo per il video.',
        services_list: initialServicesData
    });

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null); 
    // editingItem structure: 
    // Simple content: { type: 'global', key: 'page_title', label: '...', value: '...', inputType: 'text' }
    // Service item: { type: 'service', index: 0, field: 'title', label: '...', value: '...', inputType: 'text' }

    useEffect(() => {
        // Wait for auth to finish loading before fetching content
        if (!authLoading) {
            fetchContent();
        }
    }, [authLoading]);

    const fetchContent = async () => {
        try {
            setLoading(true);
            
            // Fetch content directly
            const { data, error } = await supabase
                .from('site_content')
                .select('*')
                .eq('section', 'services');

            if (error) {
                console.error('Error fetching content:', error);
                // Don't throw, just log. allow default content to show.
                return;
            }

            if (data && data.length > 0) {
                // Use functional update to avoid stale closure
                setContent(prevContent => {
                    const newContent = { ...prevContent };
                    data.forEach(item => {
                        if (item.type === 'json') {
                             try {
                                const val = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
                                newContent[item.key] = val;
                             } catch (e) {
                                 console.error("Error parsing JSON for key", item.key, e);
                             }
                        } else {
                            newContent[item.key] = item.value;
                        }
                    });
                    
                    // Safety check
                    if (!Array.isArray(newContent.services_list)) { 
                        newContent.services_list = []; 
                    }
                    
                    return newContent;
                });
            }
        } catch (err) {
            console.error('Unexpected error fetching services:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle Global Content Edit (Title, Subtitle)
    const handleEditGlobal = (key, label, inputType = 'text') => {
        setEditingItem({
            type: 'global',
            key,
            label,
            value: content[key],
            inputType
        });
        setModalOpen(true);
    };

    // Handle Service Item Edit
    const handleEditService = (index, field, label, inputType = 'text') => {
        const service = content.services_list[index];
        setEditingItem({
            type: 'service',
            index,
            field,
            label: `${label} (${service.title})`,
            value: service[field],
            inputType
        });
        setModalOpen(true);
    };

    const handleSave = async (keyIgnored, newValue) => {
        try {
            const currentItem = editingItem;
            if (!currentItem) return;

            // 1. Update Local State & Prepare DB Payload
            let dbKey = '';
            let dbValue = null;

            if (currentItem.type === 'global') {
                dbKey = currentItem.key;
                dbValue = newValue;

                setContent(prev => ({ ...prev, [dbKey]: newValue }));

            } else if (currentItem.type === 'service') {
                dbKey = 'services_list';
                
                // Construct new services list
                const updatedList = [...content.services_list];
                updatedList[currentItem.index] = {
                    ...updatedList[currentItem.index],
                    [currentItem.field]: newValue
                };

                dbValue = updatedList; // This is the full JSON array

                setContent(prev => ({ ...prev, services_list: updatedList }));
            }

            // 2. Save to DB
            const { error } = await supabase
                .from('site_content')
                .upsert({ 
                    section: 'services',
                    key: dbKey, 
                    value: dbValue,
                    updated_at: new Date()
                }, { onConflict: 'key' });

            if (error) throw error;
            console.log('Saved successfully');

        } catch (err) {
            console.error("Error saving to DB:", err);
            alert("Errore durante il salvataggio. Riprova.");
            // Optionally revert local state here if strict consistency needed
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="pt-20 relative"
        >
            <SEO 
                title="Servizi | Noleggio Studio TV, Regia Mobile e Live Streaming"
                description="Scopri tutti i nostri servizi: noleggio studi televisivi, regia mobile, live streaming professionale, post-produzione, eventi aziendali. Attrezzature 4K e personale specializzato."
                keywords="servizi noleggio studio, regia mobile 4K, live streaming eventi, post produzione video, eventi aziendali Varese, personale tecnico broadcast, noleggio attrezzature video"
                url="/servizi"
            />
            
            {/* Edit Modal */}
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
                    <Edit size={16} /> Modalità Admin Attiva
                </div>
            )}

            <div className="bg-surface py-24 relative group/header">
                <div className="container mx-auto px-6 text-center">
                    <div className="relative inline-block">
                        <h1 className="text-5xl font-serif font-bold text-accent mb-6">
                            {content.page_title}
                        </h1>
                        {isAdmin && (
                            <button 
                                onClick={() => handleEditGlobal('page_title', 'Titolo Pagina', 'text')}
                                className="absolute -right-12 top-0 p-2 text-primary hover:bg-primary/10 rounded-full transition-colors opacity-0 group-hover/header:opacity-100"
                                title="Modifica Titolo"
                            >
                                <Edit size={20} />
                            </button>
                        )}
                    </div>
                    
                    <div className="relative max-w-2xl mx-auto group/desc">
                        <p className="text-slate-500 text-lg">
                            {content.page_subtitle}
                        </p>
                        {isAdmin && (
                            <button 
                                onClick={() => handleEditGlobal('page_subtitle', 'Sottotitolo Pagina', 'textarea')}
                                className="absolute -right-12 top-0 p-2 text-primary hover:bg-primary/10 rounded-full transition-colors opacity-0 group-hover/desc:opacity-100"
                                title="Modifica Sottotitolo"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
                        {Array.isArray(content.services_list) && content.services_list.map((service, index) => (
                            <motion.div 
                                key={index}
                                className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full group relative"
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
                                
                                <div className="p-8 flex-1 flex flex-col relative group/card-content">
                                    <div className="relative mb-4">
                                        <h3 className="text-2xl font-serif font-bold text-accent pr-8">{service.title}</h3>
                                        {isAdmin && (
                                            <button 
                                                onClick={() => handleEditService(index, 'title', 'Nome Servizio', 'text')}
                                                className="absolute right-0 top-0 text-primary hover:bg-primary/10 p-1 rounded transition-opacity opacity-0 group-hover/card-content:opacity-100"
                                                title="Modifica Nome"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="relative mb-8 flex-1">
                                        <p className="text-slate-600 leading-relaxed pr-8">{service.desc}</p>
                                        {isAdmin && (
                                            <button 
                                                onClick={() => handleEditService(index, 'desc', 'Descrizione Servizio', 'textarea')}
                                                className="absolute right-0 top-0 text-primary hover:bg-primary/10 p-1 rounded transition-opacity opacity-0 group-hover/card-content:opacity-100"
                                                title="Modifica Descrizione"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        )}
                                    </div>

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
