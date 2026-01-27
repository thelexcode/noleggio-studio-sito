import { motion } from 'framer-motion';
import { Send, MapPin, PhoneCall, Mail } from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    alert('Grazie per la tua richiesta! Ti contatteremo presto per il preventivo.');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="bg-surface min-h-screen pt-20"
    >
      <div className="bg-white py-20 border-b border-slate-200 mb-16">
         <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl font-serif font-bold text-accent mb-6">Richiedi un <span className="text-primary">Preventivo</span></h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Siamo a tua disposizione per trasformare il tuo progetto in realtà.</p>
         </div>
      </div>

      <div className="container mx-auto px-6 pb-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
              <div className="bg-white p-10 rounded-2xl shadow-soft border border-slate-100">
                  <h3 className="text-2xl font-serif font-bold mb-8 text-accent">Contatti Diretti</h3>
                  <div className="space-y-8">
                      <div className="flex items-center gap-6 group">
                          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                             <MapPin size={24} />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Dove siamo</p>
                              <p className="text-xl font-medium text-accent">Via degli Studi 10, Milano</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-6 group">
                          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                             <PhoneCall size={24} />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Telefono</p>
                              <p className="text-xl font-medium text-accent">+39 02 12345678</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-6 group">
                          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                             <Mail size={24} />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                              <p className="text-xl font-medium text-accent">info@noleggiostudio.tv</p>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="bg-accent p-10 rounded-2xl shadow-lg text-white relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                  <h3 className="text-2xl font-serif font-bold mb-6">Orari Studio</h3>
                  <div className="space-y-3 text-slate-300 relative z-10">
                    <p className="flex justify-between border-b border-white/10 pb-2"><span>Lunedì - Venerdì</span> <span className="text-white font-medium">09:00 - 19:00</span></p>
                    <p className="flex justify-between border-b border-white/10 pb-2"><span>Sabato</span> <span className="text-white font-medium">Su prenotazione</span></p>
                    <p className="flex justify-between pt-2"><span>Domenica</span> <span className="text-white font-medium">Chiuso</span></p>
                  </div>
              </div>
          </motion.div>

          {/* Form */}
          <motion.form 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100"
            onSubmit={handleSubmit}
          >
              <h3 className="text-2xl font-serif font-bold mb-8 text-accent">Dettagli Progetto</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Nome</label>
                      <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-accent focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all" placeholder="Il tuo nome" required />
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Cognome</label>
                      <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-accent focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all" placeholder="Il tuo cognome" required />
                  </div>
              </div>

              <div className="space-y-2 mb-6">
                  <label className="text-sm font-bold text-slate-700">Email</label>
                  <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-accent focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all" placeholder="nome@azienda.com" required />
              </div>

              <div className="space-y-2 mb-6">
                  <label className="text-sm font-bold text-slate-700">Servizio richiesto</label>
                  <div className="relative">
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-accent appearance-none focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer">
                        <option>Noleggio Studio</option>
                        <option>Regia Mobile</option>
                        <option>Live Streaming</option>
                        <option>Post Produzione</option>
                        <option>Altro</option>
                    </select>
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
              </div>

              <div className="space-y-2 mb-8">
                  <label className="text-sm font-bold text-slate-700">Messaggio</label>
                  <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-accent h-32 resize-y focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all" placeholder="Descrivi il tuo progetto e le tue esigenze..." required></textarea>
              </div>

              <button type="submit" className="w-full btn justify-center text-lg py-4 shadow-lg shadow-primary/30">
                  Invia Richiesta <Send size={18} />
              </button>
          </motion.form>

      </div>
      </div>
    </motion.div>
  );
}

export default Contact;
