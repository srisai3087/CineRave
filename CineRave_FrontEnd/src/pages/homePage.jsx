import MoviesList from '../components/moviesList';
import NavBar from '../components/navBar';

const HomePage = ({ User, handleLogout }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <NavBar User={User} handleLogout={handleLogout} />
      
      <main className="flex-grow">
        <MoviesList />
      </main>
      
      {/* Optional: You could add a footer here if needed */}
      {/* <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          © {new Date().getFullYear()} Movie App
        </div>
      </footer> */}
    </div>
  );
};

export default HomePage;