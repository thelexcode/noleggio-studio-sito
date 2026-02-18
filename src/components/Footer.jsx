import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
    return (
        <footer className="bg-slate-900 pt-20 pb-10 text-white mt-auto">
            <div className="container mx-auto px-6 mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                <div className="lg:col-span-2">
                    <div className="mb-6">
                        <Logo className="h-20 w-auto text-white" />
                    </div>
                    <p className="text-slate-400 max-w-sm leading-relaxed">
                        Spazi professionali e tecnologie all'avanguardia per le tue produzioni video. 
                        Qualità broadcast, regia e supporto tecnico specializzato.
                    </p>
                </div>
                <div>
                    <h4 className="text-lg font-bold mb-6 text-white/90">Esplora</h4>
                    <ul className="space-y-4">
                        <li><Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link></li>
                        <li><Link to="/chi-siamo" className="text-slate-400 hover:text-white transition-colors">Chi Siamo</Link></li>
                        <li><Link to="/servizi" className="text-slate-400 hover:text-white transition-colors">Servizi</Link></li>
                        <li><Link to="/galleria" className="text-slate-400 hover:text-white transition-colors">Galleria</Link></li>
                    </ul>
                </div>
                {/* <div>
                    <h4 className="text-lg font-bold mb-6 text-white/90">Contatti</h4>
                    <div className="space-y-4">
                        <p className="text-slate-400 flex items-start gap-3">
                            <MapPin size={20} className="shrink-0 mt-1 text-primary-light"/> 
                            Via Varese 53<br/>Busto Arsizio (Varese)
                        </p>

                        <p className="text-slate-400 flex items-center gap-3">
                            <Mail size={20} className="text-primary-light"/> 
                            info@hd-studio.it
                        </p>
                    </div>
                </div> */}
            </div>
            <div className="border-t border-white/10 pt-8 text-center text-slate-500 text-sm">
                <p>&copy; 2026 Noleggio Studio TV. Tutti i diritti riservati.</p>
            </div>
        </footer>
    );
}

export default Footer;
