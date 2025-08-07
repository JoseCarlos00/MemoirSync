import React, { useRef, useState } from 'react';
import api from '../services/api'

const AdminUpload = () => {
  const [chatFile, setChatFile] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const inputFileRef = useRef<HTMLInputElement>(null);
  const inputMediaFilesRef = useRef<HTMLInputElement>(null);

  const clearFileInputs = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }

    if (inputMediaFilesRef.current) {
      inputMediaFilesRef.current.value = '';
    }

     setChatFile(null);
			setMediaFiles(null);
  }

  const handleChatFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setChatFile(e.target.files[0]);
    }
  };

  const handleMediaFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(e.target.files);
    }
  };

  const handleProcessUploads = async () => {
    setLoading(true);
    setMessage('');

    if (!chatFile) {
      setMessage('Error: Por favor, selecciona un archivo de chat (.txt).');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      // El nombre 'chatfile' debe coincidir con el campo de multer en el backend
      formData.append('chatfile', chatFile);
      
      if (mediaFiles) {
        // El nombre 'mediafiles' debe coincidir con el campo de multer
        Array.from(mediaFiles).forEach((file) => {
          formData.append('mediafiles', file);
        });
      }

      // El nombre 'myUserName' debe coincidir con el que usa tu controlador
      formData.append('myUserName', 'Jose Carlos');

      // Realiza una única petición POST al backend con todos los archivos
      await api.post('/upload', formData)

      setMessage('Conversación y archivos multimedia procesados y guardados con éxito. 🎉');
     clearFileInputs()
    } catch (error) {
      console.error('Error durante la subida:', error);
      setMessage('Error al procesar la subida. Revisa la consola para más detalles.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-teal-400 mb-6">
          Herramienta de Carga de Conversación
        </h1>
        
        <div className="mb-6">
          <label className="block text-gray-400 font-bold mb-2" htmlFor="chat-file">
            1. Subir Archivo de Chat (.txt)
          </label>
          <input
            id="chat-file"
            type="file"
            accept=".txt"
            ref={inputFileRef}
            onChange={handleChatFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-400 font-bold mb-2" htmlFor="media-files">
            2. Subir Archivos Multimedia (Opcional)
          </label>
          <input
            accept="image/*,video/*,audio/*"
            id="media-files"
            type="file"
            ref={inputMediaFilesRef}
            multiple
            onChange={handleMediaFilesChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />
        </div>

        <button
          onClick={handleProcessUploads}
          disabled={loading || !chatFile}
          className="w-full px-4 py-3 text-lg font-bold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Procesando...' : 'Procesar y Guardar Conversación'}
        </button>

        {message && (
          <p className="mt-4 text-center font-semibold text-sm">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminUpload;
