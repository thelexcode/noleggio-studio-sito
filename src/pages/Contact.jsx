import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, PhoneCall, Mail, Edit, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';
import SEO from '../components/SEO';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import EditContentModal from '../components/EditContentModal';

const initialContent = {
    page_title: "Richiedi un Preventivo",
    page_subtitle: "Siamo a tua disposizione per trasformare il tuo progetto in realtà.",
    contact_info_title: "Contatti Diretti",
    address_label: "Dove siamo",
    address_value: "Via Varese 53, Busto Arsizio (Varese)",
    email_label: "Email",
    email_value: "info@hd-studio.it",
    phone_label: "Telefono",
    phone_value: "377 097 97 99",
    hours_title: "Orari Studio",
    hours_weekdays_label: "Lunedì - Venerdì",
    hours_weekdays_value: "09:00 - 19:00",
    hours_saturday_label: "Sabato",
    hours_saturday_value: "Su prenotazione",
    hours_sunday_label: "Domenica",
    hours_sunday_value: "Chiuso",
    form_title: "Dettagli Progetto"
};

const Contact = () => {
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(initialContent);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: 'Noleggio Studio',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading) {
        fetchContent();
    }
  }, [authLoading]);

  const fetchContent = async () => {
    try {
        setLoading(true);
        const { data, error } = await supabase
            .from('site_content')
            .select('*')
            .eq('section', 'contact');

        if (error) {
            console.error('Error fetching contact content:', error);
            // Fallback to initialContent
            setLoading(false);
            return;
        }

        if (data && data.length > 0) {
            const newContent = { ...initialContent };
            data.forEach(item => {
                newContent[item.key] = item.value;
            });
            setContent(newContent);
        }
    } catch (err) {
        console.error('Unexpected error fetching contact content:', err);
    } finally {
        setLoading(false);
    }
  };

  const handleEdit = (key, label, inputType = 'text') => {
      setEditingItem({
          key,
          label,
          value: content[key],
          inputType
      });
      setModalOpen(true);
  };

  const handleSave = async (key, newValue) => {
      try {
          // Update local state
          setContent(prev => ({ ...prev, [key]: newValue }));

          // Save to DB
          const { error } = await supabase
              .from('site_content')
              .upsert({
                  section: 'contact',
                  key: key,
                  value: newValue,
                  type: 'text',
                  updated_at: new Date()
              }, {
                  onConflict: 'section,key'
              });

          if (error) throw error;
          
      } catch (err) {
          console.error("Error saving content:", err);
          showError("Errore durante il salvataggio delle modifiche");
      }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const templateParams = {
      from_name: `${formData.firstName} ${formData.lastName}`,
      from_email: formData.email,
      from_phone: formData.phone || 'Non fornito',
      request_type: formData.service,
      message: formData.message
    };

    try {
      await emailjs.send(
        'service_8am3wno',
        'template_pudhumm',
        templateParams,
        'bW9IEmMvsDXPcxZcj'
      );

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: 'Noleggio Studio',
        message: ''
      });
      
      showSuccess('Grazie per la tua richiesta! Ti contatteremo al più presto.');
    } catch (error) {
      console.error('Errore invio email:', error);
      showError('Si è verificato un errore. Riprova o contattaci direttamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const EditBtn = ({ k, label, type = 'text', className = '' }) => isAdmin && (
      <button 
          onClick={(e) => { e.stopPropagation(); handleEdit(k, label, type); }}
          className={`text-primary hover:bg-primary/10 p-1 rounded-full transition-all opacity-0 group-hover:opacity-100 absolute ${className}`}
          title={`Modifica ${label}`}
      >
          <Edit size={16} />
      </button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="bg-surface min-h-screen pt-20"
    >
      <SEO 
        title="Preventivo Gratuito | Noleggio Studio TV Busto Arsizio"
        description="Richiedi un preventivo gratuito per il noleggio di studi televisivi, regia mobile e live streaming a Busto Arsizio. Sopralluoghi e consulenze personalizzate senza impegno."
        keywords="preventivo studio tv, richiesta preventivo noleggio studio, preventivo regia mobile, consulenza broadcast Varese, preventivo live streaming"
        url="/contatti"
      />
      
      <EditContentModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        contentKey={editingItem?.key}
        initialValue={editingItem?.value}
        label={editingItem?.label}
        type={editingItem?.inputType}
      />

      {isAdmin && (
          <div className="fixed top-24 right-6 z-40 bg-accent text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse pointer-events-none opacity-80">
              <Edit size={16} /> Modalità Admin Attiva
          </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <>
          <div className="bg-white py-20 border-b border-slate-200 mb-16 relative group">
             <div className="container mx-auto px-6 text-center relative">
                <div className="relative inline-block">
                    <h1 className="text-5xl font-serif font-bold text-accent mb-6">
                        {/* Highlights logic could be improved, simplified here */}
                        {content.page_title}
                    </h1>
                    <EditBtn k="page_title" label="Titolo Pagina" className="-right-10 top-2" />
                </div>
                <div className="relative inline-block w-full max-w-2xl mx-auto">
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        {content.page_subtitle}
                    </p>
                    <EditBtn k="page_subtitle" label="Sottotitolo" type="textarea" className="-right-10 top-0" />
                </div>
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
                  <div className="bg-white p-6 md:p-10 rounded-2xl shadow-soft border border-slate-100 group relative">
                      <div className="flex items-center gap-4 mb-8">
                        <h3 className="text-2xl font-serif font-bold text-accent">{content.contact_info_title}</h3>
                        <EditBtn k="contact_info_title" label="Titolo Contatti" className="static ml-2 opacity-0 group-hover:opacity-100" />
                      </div>
                      
                      <div className="space-y-8">
                          <div className="flex items-start gap-4 md:items-center md:gap-6 group/item relative">
                              <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                 <MapPin size={24} />
                              </div>
                              <div className="relative pr-8">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{content.address_label}</p>
                                    <EditBtn k="address_label" label="Etichetta Indirizzo" className="relative -top-1 ml-2 opacity-0 group-hover/item:opacity-100" />
                                  </div>
                                  <p className="text-xl font-medium text-accent">{content.address_value}</p>
                                  <EditBtn k="address_value" label="Valore Indirizzo" className="right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100" />
                              </div>
                          </div>
                          <div className="flex items-start gap-4 md:items-center md:gap-6 group/item relative">
                              <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                 <Mail size={24} />
                              </div>
                              <div className="relative pr-8">
                                  <div className="flex items-center gap-2">
                                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{content.email_label}</p>
                                      <EditBtn k="email_label" label="Etichetta Email" className="relative -top-1 ml-2 opacity-0 group-hover/item:opacity-100" />
                                  </div>
                                  <p className="text-xl font-medium text-accent">{content.email_value}</p>
                                  <EditBtn k="email_value" label="Valore Email" className="right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100" />
                              </div>
                          </div>
                          <div className="flex items-start gap-4 md:items-center md:gap-6 group/item relative">
                              <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                 <PhoneCall size={24} />
                              </div>
                              <div className="relative pr-8">
                                  <div className="flex items-center gap-2">
                                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{content.phone_label}</p>
                                      <EditBtn k="phone_label" label="Etichetta Telefono" className="relative -top-1 ml-2 opacity-0 group-hover/item:opacity-100" />
                                  </div>
                                  <p className="text-xl font-medium text-accent">{content.phone_value}</p>
                                  <EditBtn k="phone_value" label="Valore Telefono" className="right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100" />
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="bg-accent p-6 md:p-10 rounded-2xl shadow-lg text-white relative overflow-hidden group">
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                      <div className="relative z-10 mb-6 flex items-center gap-4">
                        <h3 className="text-2xl font-serif font-bold">{content.hours_title}</h3>
                        {isAdmin && (
                             <button 
                                 onClick={() => handleEdit('hours_title', 'Titolo Orari')}
                                 className="text-white/50 hover:text-white p-1 rounded-full transition-all opacity-0 group-hover:opacity-100 absolute right-0 top-0"
                             >
                                 <Edit size={16} />
                             </button>
                        )}
                      </div>
                      
                      <div className="space-y-3 text-slate-300 relative z-10 group/hours">
                        {/* Weekdays */}
                        <div className="flex justify-between border-b border-white/10 pb-2 relative group/line">
                            <span className="flex items-center gap-2">
                                {content.hours_weekdays_label} 
                                {isAdmin && <button onClick={() => handleEdit('hours_weekdays_label', 'Etichetta Settimana')} className="text-white/30 hover:text-white p-1 opacity-0 group-hover/line:opacity-100"><Edit size={12} /></button>}
                            </span>
                            <span className="text-white font-medium flex items-center gap-2">
                                {content.hours_weekdays_value}
                                {isAdmin && <button onClick={() => handleEdit('hours_weekdays_value', 'Orari Settimana')} className="text-white/30 hover:text-white p-1 opacity-0 group-hover/line:opacity-100"><Edit size={12} /></button>}
                            </span>
                        </div>
                        {/* Saturday */}
                        <div className="flex justify-between border-b border-white/10 pb-2 relative group/line">
                             <span className="flex items-center gap-2">
                                {content.hours_saturday_label} 
                                {isAdmin && <button onClick={() => handleEdit('hours_saturday_label', 'Etichetta Sabato')} className="text-white/30 hover:text-white p-1 opacity-0 group-hover/line:opacity-100"><Edit size={12} /></button>}
                            </span>
                            <span className="text-white font-medium flex items-center gap-2">
                                {content.hours_saturday_value}
                                {isAdmin && <button onClick={() => handleEdit('hours_saturday_value', 'Orari Sabato')} className="text-white/30 hover:text-white p-1 opacity-0 group-hover/line:opacity-100"><Edit size={12} /></button>}
                            </span>
                        </div>
                        {/* Sunday */}
                        <div className="flex justify-between pt-2 relative group/line">
                             <span className="flex items-center gap-2">
                                {content.hours_sunday_label} 
                                {isAdmin && <button onClick={() => handleEdit('hours_sunday_label', 'Etichetta Domenica')} className="text-white/30 hover:text-white p-1 opacity-0 group-hover/line:opacity-100"><Edit size={12} /></button>}
                            </span>
                            <span className="text-white font-medium flex items-center gap-2">
                                {content.hours_sunday_value}
                                {isAdmin && <button onClick={() => handleEdit('hours_sunday_value', 'Orari Domenica')} className="text-white/30 hover:text-white p-1 opacity-0 group-hover/line:opacity-100"><Edit size={12} /></button>}
                            </span>
                        </div>
                      </div>
                  </div>
              </motion.div>

              {/* Form */}
              <motion.form 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-slate-100 relative group"
                onSubmit={handleSubmit}
              >
                   <div className="flex items-center gap-4 mb-8">
                     <h3 className="text-2xl font-serif font-bold text-accent">{content.form_title}</h3>
                     <EditBtn k="form_title" label="Titolo Form" className="static ml-2 opacity-0 group-hover:opacity-100" />
                   </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Nome</label>
                          <input 
                            type="text" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-accent focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all" 
                            placeholder="Il tuo nome" 
                            required 
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Cognome</label>
                          <input 
                            type="text" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-accent focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all" 
                            placeholder="Il tuo cognome" 
                            required 
                          />
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Email</label>
                          <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-accent focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all" 
                            placeholder="nome@azienda.com" 
                            required 
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Telefono</label>
                          <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-accent focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all" 
                            placeholder="+39 xxx xxx xxxx" 
                          />
                      </div>
                  </div>

                  <div className="space-y-2 mb-6">
                      <label className="text-sm font-bold text-slate-700">Servizio richiesto</label>
                      <div className="relative">
                        <select 
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-accent appearance-none focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                        >
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
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-accent h-32 resize-y focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all" 
                        placeholder="Descrivi il tuo progetto e le tue esigenze..." 
                        required
                      ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full btn justify-center text-lg py-4 shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      {isSubmitting ? 'Invio in corso...' : 'Invia Richiesta'} {!isSubmitting && <Send size={18} />}
                  </button>
              </motion.form>

             </div>
          </div>
        </>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </motion.div>
  );
}

export default Contact;
