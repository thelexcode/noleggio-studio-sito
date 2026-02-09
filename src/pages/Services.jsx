import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
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
  return (
    <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="pt-20"
    >
        <div className="bg-surface py-24">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-5xl font-serif font-bold text-accent mb-6">I Nostri <span className="text-primary">Servizi</span></h1>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                    Dalla ripresa alla post-produzione, offriamo un ecosistema completo per il video.
                </p>
            </div>
        </div>

        <div className="container mx-auto px-6 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {services.map((service, index) => (
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
                                    {service.features.map((f, i) => (
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
        </div>
        
        {/* Call to Action Strip */}
        {/* <div className="bg-accent py-16 text-center text-white">
            <div className="container mx-auto px-6">
                 <h2 className="text-3xl font-serif mb-6">Non trovi quello che cerchi?</h2>
                 <p className="text-slate-400 mb-8">Contattaci per una soluzione personalizzata.</p>
                 <Link to="/contatti" className="btn bg-white text-accent hover:bg-slate-200">Parla con noi</Link>
            </div>
        </div> */}
    </motion.div>
  );
}

export default Services;
