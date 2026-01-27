import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="pt-20"
    >
       {/* Header */}
       <div className="bg-surface py-20 border-b border-slate-200">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-accent mb-6">Chi <span className="text-primary">Siamo</span></h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                    Professionisti della visione, tecnologi dell'immagine.
                </p>
            </div>
       </div>

      <div className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="text-3xl font-serif font-bold mb-8 text-accent">Oltre il Semplice Studio</h2>
                <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                    <p>
                        Siamo una realtà consolidata nel mondo delle produzioni televisive e dello streaming. 
                        Offriamo non solo spazi, ma <strong className="text-primary font-medium">soluzioni complete</strong> per chi cerca professionalità e tecnologia.
                    </p>
                    <p>
                        Il nostro studio nasce per rispondere alla crescente domanda di contenuti video di alta qualità, 
                        offrendo a case di produzione, agenzie e aziende uno spazio versatile e tecnologicamente avanzato.
                    </p>
                    <p>
                        Il nostro team è composto da registi, operatori, tecnici del suono e direttori della fotografia 
                        con anni di esperienza nei principali network televisivi.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <motion.img 
                    whileHover={{ scale: 1.02 }}
                    src="/images/In2.jpg" 
                    alt="Interno Studio"
                    className="rounded-2xl w-full h-72 object-cover shadow-lg"
                />
                <motion.div className="mt-12">
                    <motion.img 
                        whileHover={{ scale: 1.02 }}
                        src="/images/S4.jpg" 
                        alt="Studio Set"
                        className="rounded-2xl w-full h-72 object-cover shadow-lg"
                    />
                </motion.div>
            </div>
        </div>
      </div>
      
      {/* Team/Philosophy Section */}
      <div className="py-24 bg-slate-50">
          <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                 <h2 className="section-title mb-6">La Nostra <span className="text-primary">Filosofia</span></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: 'Innovazione', text: 'Tecnologie all\'avanguardia per flussi di lavoro efficienti.', color: 'border-primary' },
                    { title: 'Flessibilità', text: 'Adattabili ad ogni esigenza, dallo shooting alla diretta TV.', color: 'border-indigo-400' },
                    { title: 'Passione', text: 'Cura del dettaglio per trasformare idee in emozioni.', color: 'border-slate-800' }
                  ].map((item, i) => (
                      <div key={i} className={`bg-white p-8 rounded-xl shadow-sm border-t-4 ${item.color} hover:shadow-md transition-shadow`}>
                          <h3 className="text-xl font-bold mb-4 text-accent">{item.title}</h3>
                          <p className="text-slate-600">{item.text}</p>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </motion.div>
  );
}

export default About;
