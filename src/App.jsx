import { useEffect, useState } from "react";
import Search from "./components/search.jsx";
import Loader from "./components/loader.jsx";
import MovieCard from "./components/movieCard.jsx";
import { useDebounce } from "react-use";

import { updateSearchCount, getTrendingMovies } from "./appwrite.js";

const API_BASE_URL = " https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [moviesErrorMessage, setMoviesErrorMessage] = useState("");
  const [trendingErrorMessage, setTrendingErrorMessage] = useState("");

  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const [moviesIsLoading, setMoviesIsLoading] = useState(false);
  const [trendingIsLoading, setTrendingIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setMoviesIsLoading(true);
    setMoviesErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.response == "False") {
        setMoviesErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setMoviesErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setMoviesIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    setTrendingIsLoading(true);
    setTrendingErrorMessage("");
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
      setTrendingErrorMessage(`Error Fetching Trending movies: ${error}`);
    } finally {
      setTrendingIsLoading(false);
    }
  };
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);
  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You&apos;ll Enjoy
            without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="trending mt-[14px]">
          <h2>Trending Movies</h2>
          {trendingIsLoading ? (
            <Loader />
          ) : trendingErrorMessage ? (
            <p className="text-red-500">{trendingErrorMessage}</p>
          ) : (
            trendingMovies.length > 0 && (
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            )
          )}
        </section>
        <section className="all-movies">
          <h2 className="mt-[14px]">All Movies</h2>
          {moviesIsLoading ? (
            <Loader />
          ) : moviesErrorMessage ? (
            <p className="text-red-500">{moviesErrorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
        <h1 className="text-white">{searchTerm}</h1>
      </div>
    </main>
  );
};
export default App;
