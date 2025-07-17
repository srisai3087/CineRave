import { useEffect, useState } from "react";
import { FaPlay, FaStar } from "react-icons/fa";
import "./movieList.css";
import "./responsive.css";
import { Link } from "react-router";
import BackgroundImage from "./backgroundImage";
import Footer from "./footer";
const MoviesList = () => {
  const [movies, setmovies] = useState([]);

  const getData = async () => {
    const moviesRes = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/movies",
      {
        credentials: "include",
      }
    );
    const Movies = await moviesRes.json();
    const data = Movies.data;
    setmovies(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <BackgroundImage />
      <h1 className="movie-heading-top-rated">Top Rated Movies🔥</h1>
      <div className="cards">
        {movies.map((movie, index) => {
          return (
            <>
              <div className="card" key={index}>
                <div className="imagediv">
                  <div className="rating-badge">
                    <FaStar className="star-main" />
                    {movie.rating}
                  </div>
                  <Link to={`/moreDetails/${movie._id}`}>
                    <img className="image" src={movie.poster} />
                  </Link>
                </div>
                <div className="description">
                  <h2>{movie.title}</h2>
                  <div className="genere_main">
                    {movie.genere.map((gn) => {
                      return <p className="single">{gn} / </p>;
                    })}
                  </div>
                </div>
                <a href={movie.trailer} target="_blank">
                  <button className="play-button">
                    <div className="TrailerText">
                      <FaPlay />
                      <p>Trailer</p>
                    </div>
                  </button>
                </a>
              </div>
            </>
          );
        })}
      </div>
      <Footer />
    </>
  );
};

export default MoviesList;
