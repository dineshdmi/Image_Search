import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'https://api.unsplash.com/search/photos';
const IMAGES_PER_PAGE = 8;

function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setErrorMsg('');
        setLoading(true);
        const { data } = await axios.get(
          `${API_URL}?query=${searchInput.current.value
          }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${import.meta.env.VITE_API_KEY}`
        );

        if (page > 1) {
          setImages((prevImages) => [...prevImages, ...data.results]);
        } else {
          setImages(data.results);
        }

        setTotalPages(data.total_pages);
        setLoading(false);
        setLoadMoreLoading(false);
        setSearchPerformed(true); // Set searchPerformed to true after fetching images
      }
    } catch (error) {
      setErrorMsg('Error fetching images. Try again later.');
      console.log(error);
      setLoading(false);
      setLoadMoreLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleSearch = async (event) => {
    event.preventDefault();
    setPage(1);
    setLoadMoreLoading(false);
    setSearchPerformed(false); // Reset searchPerformed before searching
    fetchImages();
  };

  const handleLoadMore = () => {
    setLoadMoreLoading(true);
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div style={{ backgroundColor: '#E0E0E0', padding: '130px', margin: '1px' }}>
      <Form onSubmit={handleSearch} style={{ width: '100%' }}>
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <FormControl
            type='search'
            placeholder='Search For Image...'
            className='mr-sm-2 search-input'
            ref={searchInput}
            style={{ flex: '1', height: '50px', width: 'calc(10px - 28px)', borderRadius: '5px 0 0 5px', marginRight: '8px' }}
          />
          <Button
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '1px',
              backgroundColor: 'black',
            }}
            variant='primary'
            onClick={handleSearch}
          >
            <FaSearch />
          </Button>
        </div>
      </Form>
      {errorMsg && <p style={{ textAlign: 'center', color: 'red' }}>{errorMsg}</p>}

      {/* Conditionally render the result section */}
      {searchPerformed && (
        <>

          <h1 style={{ textAlign: 'start', fontStyle: 'bold', fontSize: '1.5em' }}>
            {searchInput.current && searchInput.current.value}
          </h1>
          <p style={{ textAlign: 'start', fontStyle: 'bold', fontSize: '1.2em' }}>
            {totalPages * IMAGES_PER_PAGE} images has been found
          </p>
        </>
      )}
      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '1.2em' }}>Loading...</p>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {images.map((image) => (
            <div key={image.id} style={{ margin: '10px', width: 'calc(25% - 20px)', textAlign: 'center' }}>
              <img
                src={image.urls.small}
                alt={image.alt_description}
                style={{ width: '100%', height: '100%', maxHeight: '300px', objectFit: 'cover', flex: 1 }}
              />
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {page < totalPages && (
          <Button onClick={handleLoadMore} disabled={loadMoreLoading} style={{ backgroundColor: 'black', borderRadius: '5px' }}>
            {loadMoreLoading ? 'Loading...' : 'Load More'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default App;
