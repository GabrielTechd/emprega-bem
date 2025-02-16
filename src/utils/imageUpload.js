import { supabase } from '../config/supabase';

export const uploadImage = async (file, type) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const bucket = type === 'foto' ? 'profile-photos' : 'resumes';
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
  }
};

export const deleteImage = async (path, type) => {
  if (!path) return;
  
  try {
    const bucket = type === 'foto' ? 'profile-photos' : 'resumes';
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Erro ao deletar arquivo:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    throw error;
  }
}; 