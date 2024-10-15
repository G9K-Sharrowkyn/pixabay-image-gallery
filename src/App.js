import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const PIXABAY_API_KEY = '46514413-bbda870c6c7ccac31472933d2';

  const fetchImages = useCallback(async (currentPage) => {
    if (!query) return;
    setLoading(true);
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&page=${currentPage}`;

    try {
      const response = await axios.get(url);
      setImages((prevImages) => [...prevImages, ...response.data.hits]);
    } catch (error) {
      console.error('Błąd pobierania obrazów:', error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (page > 1) {
      fetchImages(page);
    }
  }, [page, fetchImages]);

  const searchImages = async (e) => {
    e.preventDefault();
    setPage(1);
    setImages([]);
    fetchImages(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-5xl font-extrabold text-gray-800 my-8 animate-bounce">Pixabay Image Gallery</h1>

      <form onSubmit={searchImages} className="w-full max-w-lg flex justify-center mb-12">
        <input 
          type="text" 
          className="flex-grow p-4 rounded-l-lg border border-gray-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
          placeholder="Look for..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none transform transition duration-300 hover:scale-105 text-lg"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {images.length > 0 && images.map((image) => (
          <div key={image.id} className="relative group overflow-hidden rounded-lg shadow-lg transition transform duration-300 hover:scale-105">
            <img 
              src={image.webformatURL} 
              alt={image.tags} 
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900 bg-opacity-75 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm">{image.tags}</p>
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="text-gray-500 text-lg mt-10">Loading more images...</p>}
    </div>
  );
};

export default App;
