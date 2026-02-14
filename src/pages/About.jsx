import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';
import EditContentModal from '../components/EditContentModal';
import { useContent } from '../hooks/useContent';

const initialContent = {
    page_title: 'Chi Siamo',
    page_subtitle: 'Professionisti della visione, tecnologi dell\'immagine.',
    main_title: 'Oltre il Semplice Studio',
    main_text_1: 'Siamo una realtà consolidata nel mondo delle produzioni televisive e dello streaming. Offriamo non solo spazi, ma soluzioni complete per chi cerca professionalità e tecnologia.',
    main_text_2: 'Il nostro studio nasce per rispondere alla crescente domanda di contenuti video di alta qualità, offrendo a case di produzione, agenzie e aziende uno spazio versatile e tecnologicamente avanzato.',
    main_text_3: 'Il nostro team è composto da registi, operatori, tecnici del suono e direttori della fotografia con anni di esperienza nei principali network televisivi.',
    philosophy_title: 'La Nostra Filosofia',
    philosophy_list: [
        { title: 'Innovazione', text: 'Tecnologie all\'avanguardia per flussi di lavoro efficienti.', color: 'border-primary' },
        { title: 'Flessibilità', text: 'Adattabili ad ogni esigenza, dallo shooting alla diretta TV.', color: 'border-indigo-400' },
        { title: 'Passione', text: 'Cura del dettaglio per trasformare idee in emozioni.', color: 'border-slate-800' }
    ]
};

const About = () => {
  const { 
      content, loading: contentLoading, isAdmin, modalOpen, setModalOpen, editingItem, handleEdit, handleEditItem, handleSave 
  } = useContent('about', initialContent);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="pt-20 relative"
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

       {/* Header */}
       <div className="bg-surface py-20 border-b border-slate-200 relative group/header">
            <div className="container mx-auto px-6 text-center">
                <div className="relative inline-block">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-accent mb-6">
                        {content.page_title}
                    </h1>
                    {isAdmin && <button onClick={() => handleEdit('page_title', 'Titolo Pagina', 'text')} className="absolute -right-8 top-0 text-primary opacity-0 group-hover/header:opacity-100"><Edit size={20}/></button>}
                </div>
                
                <div className="relative max-w-2xl mx-auto">
                    <p className="text-xl text-slate-500">
                        {content.page_subtitle}
                    </p>
                    {isAdmin && <button onClick={() => handleEdit('page_subtitle', 'Sottotitolo', 'text')} className="absolute -right-8 top-0 text-primary opacity-0 group-hover/header:opacity-100"><Edit size={16}/></button>}
                </div>
            </div>
       </div>

      <div className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group/main">
                <div className="relative inline-block mb-8">
                    <h2 className="text-3xl font-serif font-bold text-accent">{content.main_title}</h2>
                    {isAdmin && <button onClick={() => handleEdit('main_title', 'Titolo Principale', 'text')} className="absolute -right-8 top-0 text-primary opacity-0 group-hover/main:opacity-100"><Edit size={16}/></button>}
                </div>
                
                <div className="space-y-6 text-lg text-slate-600 leading-relaxed relative">
                    <div className="relative group/p1">
                        <p>{content.main_text_1}</p>
                        {isAdmin && <button onClick={() => handleEdit('main_text_1', 'Paragrafo 1', 'textarea')} className="absolute right-0 top-0 text-primary opacity-0 group-hover/p1:opacity-100"><Edit size={14}/></button>}
                    </div>
                    <div className="relative group/p2">
                        <p>{content.main_text_2}</p>
                        {isAdmin && <button onClick={() => handleEdit('main_text_2', 'Paragrafo 2', 'textarea')} className="absolute right-0 top-0 text-primary opacity-0 group-hover/p2:opacity-100"><Edit size={14}/></button>}
                    </div>
                    <div className="relative group/p3">
                        <p>{content.main_text_3}</p>
                        {isAdmin && <button onClick={() => handleEdit('main_text_3', 'Paragrafo 3', 'textarea')} className="absolute right-0 top-0 text-primary opacity-0 group-hover/p3:opacity-100"><Edit size={14}/></button>}
                    </div>
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
              <div className="text-center mb-16 relative group/philo-header">
                  <div className="relative inline-block">
                     <h2 className="section-title mb-6">{content.philosophy_title}</h2>
                     {isAdmin && <button onClick={() => handleEdit('philosophy_title', 'Titolo Filosofia', 'text')} className="absolute -right-10 top-0 text-primary opacity-0 group-hover/philo-header:opacity-100"><Edit size={16}/></button>}
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {content.philosophy_list && content.philosophy_list.map((item, i) => (
                      <div key={i} className={`bg-white p-8 rounded-xl shadow-sm border-t-4 ${item.color} hover:shadow-md transition-shadow relative group/card`}>
                          <div className="relative mb-4">
                              <h3 className="text-xl font-bold text-accent">{item.title}</h3>
                              {isAdmin && <button onClick={() => handleEditItem('philosophy_list', i, 'title', `Titolo Filosofia ${i+1}`, 'text')} className="absolute right-0 top-0 text-primary opacity-0 group-hover/card:opacity-100"><Edit size={14}/></button>}
                          </div>
                          
                          <div className="relative">
                              <p className="text-slate-600">{item.text}</p>
                              {isAdmin && <button onClick={() => handleEditItem('philosophy_list', i, 'text', `Testo Filosofia ${i+1}`, 'textarea')} className="absolute right-0 top-0 text-primary opacity-0 group-hover/card:opacity-100"><Edit size={14}/></button>}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </motion.div>
  );
}

export default About;
