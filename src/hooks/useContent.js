import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

export const useContent = (section, initialContent) => {
    const { isAdmin } = useAuth();
    const [content, setContent] = useState(initialContent);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('site_content')
                .select('*')
                .eq('section', section);

            if (data && data.length > 0) {
                const newContent = { ...content };
                data.forEach(item => {
                    if (item.type === 'json') {
                        try {
                            const val = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
                            newContent[item.key] = val;
                        } catch (e) {
                            console.error("Error parsing JSON key", item.key, e);
                        }
                    } else {
                        newContent[item.key] = item.value;
                    }
                });
                setContent(newContent);
            }
        } catch (err) {
            console.error(`Error fetching ${section} content:`, err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (key, label, inputType = 'text') => {
        setEditingItem({
            type: 'global',
            key,
            label,
            value: content[key],
            inputType
        });
        setModalOpen(true);
    };

    const handleEditItem = (listKey, index, field, label, inputType = 'text') => {
        const list = content[listKey];
        if (!list || !list[index]) return;

        setEditingItem({
            type: 'list_item',
            listKey,
            index,
            field, // field in the object (e.g. 'title'), or null if array of strings
            label,
            value: field ? list[index][field] : list[index],
            inputType
        });
        setModalOpen(true);
    };

    const handleSave = async (keyIgnored, newValue) => {
        try {
            const currentItem = editingItem;
            if (!currentItem) return;

            let dbKey = '';
            let dbValue = null;

            if (currentItem.type === 'global') {
                dbKey = currentItem.key;
                dbValue = newValue;
                setContent(prev => ({ ...prev, [dbKey]: newValue }));
            } else if (currentItem.type === 'list_item') {
                dbKey = currentItem.listKey;
                const updatedList = [...content[currentItem.listKey]];

                if (currentItem.field) {
                    // Array of objects
                    updatedList[currentItem.index] = {
                        ...updatedList[currentItem.index],
                        [currentItem.field]: newValue
                    };
                } else {
                    // Array of strings
                    updatedList[currentItem.index] = newValue;
                }

                dbValue = updatedList;
                setContent(prev => ({ ...prev, [dbKey]: updatedList }));
            }

            const { error } = await supabase
                .from('site_content')
                .upsert({
                    section,
                    key: dbKey,
                    value: dbValue,
                    updated_at: new Date()
                }, { onConflict: 'key' });

            if (error) throw error;
            console.log('Saved successfully');

        } catch (err) {
            console.error("Error saving content:", err);
            alert("Errore salvataggio.");
        }
    };

    return {
        content,
        loading,
        isAdmin,
        modalOpen,
        setModalOpen,
        editingItem,
        handleEdit,
        handleEditItem,
        handleSave
    };
};
