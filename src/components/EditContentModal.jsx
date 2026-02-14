import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';

const EditContentModal = ({ isOpen, onClose, onSave, contentKey, initialValue, label, type = 'text' }) => {
    const [value, setValue] = useState(initialValue || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setValue(initialValue || '');
    }, [initialValue, isOpen]);

    const handleSave = async () => {
        setLoading(true);
        try {
            // validating JSON if type is json
            let valueToSave = value;
            if (type === 'json') {
                try {
                    JSON.parse(value);
                } catch (e) {
                    alert("Invalid JSON format");
                    setLoading(false);
                    return;
                }
            }
            await onSave(contentKey, valueToSave);
            onClose();
        } catch (error) {
            console.error("Failed to save:", error);
            alert("Failed to save content");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-800">Modifica: <span className="text-primary">{label || contentKey}</span></h3>
                            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">Contenuto</label>
                                {type === 'textarea' || type === 'json' ? (
                                    <textarea 
                                        value={value || ''}
                                        onChange={(e) => setValue(e.target.value)}
                                        className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                                    />
                                ) : (
                                    <input 
                                        type="text" 
                                        value={value || ''}
                                        onChange={(e) => setValue(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                )}
                                {type === 'json' && <p className="text-xs text-amber-600">Attenzione: Modifica il JSON rispettando la sintassi corretta.</p>}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button 
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                            >
                                Annulla
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={loading}
                                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Salvataggio...' : <><Save size={18} /> Salva Modifiche</>}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditContentModal;
