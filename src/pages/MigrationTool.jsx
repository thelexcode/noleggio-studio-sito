import { useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const MigrationTool = () => {
    const { isAdmin } = useAuth();
    const [status, setStatus] = useState('');
    const [migrating, setMigrating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(0);

    const galleryImages = [
        '/images/S1.jpg', '/images/S2.jpg', '/images/S3.jpg', '/images/S4.jpg',
        '/images/S5.jpg', '/images/S6.jpg', '/images/S7.jpg', '/images/S8.jpg',
        '/images/R1.jpg', '/images/R2.jpg', '/images/REG1.jpg', '/images/REG2.jpg',
        '/images/E1.jpg', '/images/E2.jpg', '/images/U1.jpg', '/images/U2.jpg'
    ];

    const siteImages = [
        '/images/S1.jpg', // Home hero
        '/images/R1.jpg', // Home about
        '/images/In2.jpg', // About
        '/images/S4.jpg', // About
        '/images/S3.jpg', // Service 1
        '/images/REG1.jpg', // Service 2
        '/images/R2.jpg', // Service 3
        '/images/U1.jpg', // Service 4
        '/images/E4.jpg', // Service 5
        '/images/E2.jpg' // Service 6
    ];

    const handleMigrate = async () => {
        if (!isAdmin) return;
        if (!window.confirm("Attenzione: Questa operazione caricherà tutte le immagini locali nei bucket 'gallery' e 'site_images'. Procedere?")) return;

        setMigrating(true);
        setStatus('Inizio migrazione...');
        
        // Remove duplicates for siteImages if we don't care about duplicates, 
        // but we just upload them with their exact filename to the bucket.
        const uniqueSiteImages = [...new Set(siteImages)];
        setTotal(galleryImages.length + uniqueSiteImages.length);
        let done = 0;

        try {
            // 1. Migrate Gallery Images
            setStatus('Migrazione Galleria in corso...');
            for (const imgPath of galleryImages) {
                const fileName = imgPath.split('/').pop();
                try {
                    const response = await fetch(imgPath);
                    const blob = await response.blob();
                    
                    const { error } = await supabase.storage
                        .from('gallery')
                        .upload(fileName, blob, { upsert: true }); // upsert true so it overrides if exists
                        
                    if (error) console.error(`Error uploading ${fileName}:`, error);
                } catch (e) {
                    console.error(`Fetch failed for ${imgPath}`, e);
                }
                done++;
                setProgress(done);
            }

            // 2. Migrate Site Images
            setStatus('Migrazione Site Images in corso...');
            for (const imgPath of uniqueSiteImages) {
                const fileName = imgPath.split('/').pop();
                try {
                    const response = await fetch(imgPath);
                    const blob = await response.blob();
                    
                    const { error } = await supabase.storage
                        .from('site_images')
                        .upload(fileName, blob, { upsert: true });
                        
                    if (error) console.error(`Error uploading ${fileName}:`, error);
                } catch (e) {
                    console.error(`Fetch failed for ${imgPath}`, e);
                }
                done++;
                setProgress(done);
            }

            setStatus('Migrazione Completata con successo!');
        } catch (error) {
            console.error("Migration error:", error);
            setStatus('Errore durante la migrazione: ' + error.message);
        } finally {
            setMigrating(false);
        }
    };

    if (!isAdmin) {
        return (
            <div className="pt-32 text-center text-red-500">
                <AlertTriangle className="mx-auto mb-4" size={48} />
                <p>Accesso Negato. Effettua il login come amministratore.</p>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-24 min-h-screen bg-slate-50 flex flex-col items-center">
            <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center">
                <h1 className="text-3xl font-serif font-bold text-accent mb-6">Migrazione Immagini</h1>
                <p className="text-slate-600 mb-8">
                    Questo tool uploada automaticamente tutte le vecchie immagini statiche (/images/) nei bucket di Supabase. 
                    Assicurati di aver creato il bucket <strong>gallery</strong> e il bucket <strong>site_images</strong> prima di procedere.
                </p>

                <button 
                    onClick={handleMigrate} 
                    disabled={migrating}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-6"
                >
                    {migrating ? <Loader2 className="animate-spin" /> : null}
                    {migrating ? 'Migrazione in corso...' : 'Inizia Migrazione'}
                </button>

                {total > 0 && (
                    <div className="w-full bg-slate-100 rounded-full h-4 mb-4 overflow-hidden">
                        <div 
                            className="bg-green-500 h-4 transition-all duration-300" 
                            style={{ width: `${(progress / total) * 100}%` }}
                        />
                    </div>
                )}

                {status && (
                    <div className={`p-4 rounded-xl flex items-center justify-center gap-3 ${status.includes('Errore') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {status.includes('Completata') && <CheckCircle size={20} />}
                        <p className="font-medium">{status}</p>
                        {status.includes('Completata') && <p className="text-sm w-full mt-2 text-slate-500">Ora puoi visitare le altre pagine del sito per verificarne il corretto caricamento (l'App sta usando i path iniziali finché non li sovrascrivi con le modfiche modali, ma ora saranno disponibili nel bucket!).</p>}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MigrationTool;
