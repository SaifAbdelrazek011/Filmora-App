import PropTypes from "prop-types";
const MovieCard = ({
  movie: { original_language, poster_path, title, vote_average, release_date },
}) => {
  return (
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/no-movie.png"
        }
        alt={title}
      />
      <div className="mt-4">
        <h3>{title}</h3>

        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>

          <span>•</span>
          <p className="lang">{original_language}</p>
          <span>•</span>

          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};
MovieCard.propTypes = {
  movie: PropTypes.shape({
    original_language: PropTypes.string,
    poster_path: PropTypes.string, // poster_path is a string (URL)
    title: PropTypes.string.isRequired, // title is required
    vote_average: PropTypes.number, // vote_average is a number
    release_date: PropTypes.string,
  }).isRequired,
};
export default MovieCard;
