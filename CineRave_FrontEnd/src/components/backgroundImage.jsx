import { Link } from 'react-router';
import './backgroundImage.css';
const BackgroundImage = () => {
  return (
    <>
      <div className="content-main">
        {/* <img src="/background-image.webp" className="background-image-main" /> */}
        <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="background-image-main" />
        <div className="heading-main">
          <h1 className="main-headline">
            🎬 CineRave - Your Ultimate Movie Review Hub! 🍿
          </h1>
          <p className="main-description">
            Discover and review your favorite movies on CineRave, the ultimate
            platform for movie enthusiasts! Browse detailed movie information,
            share your thoughts, rate films, and engage with a community of
            cinephiles. CineRave brings you an interactive and seamless movie
            review experience like never before!
            <p className="key-para">
              ⭐ Rate & Review - Share your thoughts, rate movies, and
              contribute to a growing community of film lovers. Your opinions
              shape the conversation!
            </p>
          </p>

          <Link to="/login">
            <button className="button main-button">Get Started</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default BackgroundImage;
