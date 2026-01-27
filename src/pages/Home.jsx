import { motion } from 'framer-motion';
import { ArrowRight, Video, Mic, Globe, CheckCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-background"
        >
            {/* Hero Section */}
            <section className="relative h-screen min-h-[700px] flex items-center justify-center bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/S1.jpg')" }}>
                {/* Lighter overlay for contrast but keeping brightness */}
                <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                
                <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
                    <motion.span
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium tracking-wider mb-6"
                    >
                        PROFESSIONAL BROADCAST SERVICES
                    </motion.span>
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-white mb-8 leading-tight"
                    >
                        Lo Spazio per la <br/>Tua <span className="italic text-primary-light">Produzione</span>
                    </motion.h1>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-xl text-slate-200 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Studi televisivi premium con attrezzature all'avanguardia. 
                        Regia, streaming e supporto tecnico per elevare i tuoi contenuti.
                    </motion.p>
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link to="/contatti" className="btn bg-white text-primary hover:bg-slate-100 border-none">
                            Richiedi Preventivo <ArrowRight size={20} />
                        </Link>
                        <Link to="/servizi" className="px-8 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors">
                            Esplora Servizi
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features / Services Preview */}
            <section className="py-32 bg-surface">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="section-title mb-6">Eccellenza <span className="text-primary italic">Tecnica</span></h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">Ogni dettaglio è stato pensato per offrire la massima qualità produttiva.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { icon: Video, title: 'Studi Attrezzati', desc: 'Set modulari con illuminazione broadcast e limbo/green screen.' },
                            { icon: Mic, title: 'Regia A/V', desc: 'Regie tricaster 4K, mixer audio digitali e workflow SDI.' },
                            { icon: Globe, title: 'Live Streaming', desc: 'Connettività in fibra dedicata ridondata per dirette stabili.' }
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                className="bg-white p-10 rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 border border-slate-100 group"
                                whileHover={{ y: -5 }}
                            >
                                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-serif font-bold mb-4 text-accent">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

             {/* Why Choose Us */}
             <section className="py-32 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                             <span className="text-primary font-bold tracking-wider uppercase text-sm">Perché Noi</span>
                             <h2 className="text-5xl font-serif font-medium mt-4 mb-8 text-accent">Standard Televisivi,<br/>Flessibilità Digitale.</h2>
                             <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                                 Non offriamo solo uno spazio, ma un partner tecnico per la tua produzione. 
                                 Dall'idea alla messa in onda, ti supportiamo con esperienza decennale.
                             </p>
                             
                             <ul className="space-y-6">
                                {[
                                    'Tecnologie 4K Ready', 
                                    'Personale Certificato', 
                                    'Privacy e Sicurezza', 
                                    'Location Premium a Milano'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-lg text-slate-700">
                                        <div className="p-1 rounded-full bg-green-100 text-green-600"><CheckCircle size={18} /></div> 
                                        {item}
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

            {/* CTA */}
            <section className="py-32 bg-accent text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary opacity-10 blur-3xl rounded-full translate-x-1/2"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-serif mb-8">Dai Vita alle Tue Idee</h2>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-light">
                        Hai un progetto in mente? Parliamone. Il nostro team è pronto a realizzare la tua visione.
                    </p>
                    <Link to="/contatti" className="btn bg-white text-accent hover:bg-primary-light hover:text-white px-12 py-4 text-lg">
                        Inizia Ora
                    </Link>
                </div>
            </section>
        </motion.div>
    );
}

export default Home;
