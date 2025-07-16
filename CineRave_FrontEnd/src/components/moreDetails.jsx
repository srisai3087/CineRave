import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import NavBar from './navBar';
import { FaEdit, FaPlay, FaStar, FaTimes, FaTrash } from 'react-icons/fa';
import Footer from './footer';
import './responsive.css';

const MoreDetails = ({ User, handleLogout }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState({});
  const [value, setvalue] = useState(0);
  const [edit, setedit] = useState(-1);
  const [commentObj, setcommentObj] = useState({});
  const navigate = useNavigate();

  const getData = async () => {
    const resp = await fetch(
      import.meta.env.VITE_BACKEND_URL + `/movies/${id}`
    );
    const resdata = await resp.json();
    const data = resdata.data;
    setMovie(data);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (User.isLoggedin === false) {
      alert('login to post the review');
      navigate('/login');
      return;
    }

    const newObj = {
      userName: User.name,
      comment: e.target.review.value,
      rating: e.target.rating.value,
    };

    if (!newObj.comment || newObj.rating <= '1') {
      alert('comment or rating must be greater then one');
      return;
    }

    const resp = await fetch(
      import.meta.env.VITE_BACKEND_URL + `/movies/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(newObj),
        headers: {
          'content-type': 'application/json',
        },
      }
    );
    const respObj = await resp.json();
    // console.log(respObj);

    if (respObj.status === 'sucess') {
      console.log('success');
      getData();
    }
    e.target.review.value = '';
    // e.target.rating.value = 0//;
  };

  const hanldeClick = async (e, id) => {
    console.log('deleted', movie._id, id);
    const resp = await fetch(
      import.meta.env.VITE_BACKEND_URL + `/movies/${movie._id}/reviews/${id}`,
      {
        method: 'DELETE',
      }
    );
    const resObj = await resp.json();
    console.log(resObj.status);
    if (resObj.status === 'success') {
      alert('deleted sucessfully');
      getData();
    }
  };

  const handleChange = (key, value) => {
    setcommentObj((prev) => {
      const newobj = { ...prev };
      newobj[key] = value;
      // console.log(newobj.comment);
      return newobj;
    });
  };

  const handleSubmitChanges = async (id) => {
    console.log(id);
    console.log(commentObj);
    const resp = await fetch(
      import.meta.env.VITE_BACKEND_URL + `/movies/${movie._id}/reviews/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(commentObj),
        headers: {
          'content-type': 'application/json',
        },
      }
    );
    const respObj = await resp.json();
    if (respObj.status === 'success') {
      console.log('success');
      getData();
    }

    setedit(-1);
  };

  return (
    <>
      {/* /nav bar and the movie details */}
      <NavBar User={User} handleLogout={handleLogout} />
      <div className="main-image">
        <img src={movie.background} className="back-image" />
        <div className="content">
          <img src={movie.poster} className="poster" />
          <div className="details">
            <h1 className="title">{movie.title}</h1>
            <div className="genere">
              {movie.genere?.map((gn, index) => {
                return (
                  <div key={index}>
                    <span className="single-genere">{gn}</span>
                  </div>
                );
              })}
            </div>
            <p className="desc">{movie.description}</p>
            <a href={movie.trailer} target="_blank">
              <button className="button">
                <div className="TrailerText" id="trailer">
                  <FaPlay />
                  <p className="text">Trailer</p>
                </div>
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Comments/ Reviews */}
      <div className="comment-section">
        <h1 className="comment-name">Comments & Review Section</h1>
        <div className="user-section">
          <div className="form-details">
            <h3>comment as user</h3>
            <form onSubmit={handleSubmit}>
              <div className="form">
                <div>
                  <label>Review</label>
                  <textarea
                    type="text"
                    name="review"
                    placeholder="Enter comments....."
                    className="input input-review"
                  />
                </div>
                <div>
                  <label>Rating</label>
                  <div className="value">
                    <input
                      type="range"
                      name="rating"
                      value={value}
                      onChange={(e) => setvalue(e.target.value)}
                      placeholder="1 - 10"
                      className="input input-rating"
                      min="1"
                      step="0.5"
                      max="10"
                    />
                    <FaStar className="star" />
                    <span className="number_value">{value}</span>
                  </div>
                </div>
                <button type="submit" className="post">
                  Post
                </button>
              </div>
            </form>
          </div>

          <h3 className="comment-reviews">
            Comments{' '}
            <span className="total-comments">{movie.reviews?.length}</span>
          </h3>
          <div className="user-reviews">
            {movie.reviews?.map((rev, index) => {
              return (
                <div className="single-card" key={index}>
                  <h4>{rev.userName}</h4>
                  <p className="comment-line">
                    {index === edit ? (
                      <textarea
                        className="input input-review"
                        value={commentObj.comment}
                        onChange={(e) => {
                          handleChange('comment', e.target.value);
                        }}
                        required
                        maxlength="30"
                      />
                    ) : (
                      rev.comment
                    )}
                  </p>
                  <div className="rating-number">
                    <FaStar />
                    <p className="number">{rev.rating}</p>
                  </div>

                  {User.name === rev.userName ? (
                    <button
                      className="delete-button"
                      onClick={(e) => hanldeClick(e, rev._id)}
                    >
                      <FaTrash />
                    </button>
                  ) : (
                    ''
                  )}

                  {index === edit ? (
                    <>
                      <div>
                        <button
                          onClick={() => handleSubmitChanges(rev._id)}
                          className="submit-changes"
                        >
                          Submit Changes
                        </button>
                      </div>
                      <div>
                        <button
                          className="cancel"
                          onClick={() => {
                            setedit(-1);
                            setcommentObj({});
                          }}
                        >
                          <FaTimes className="icon" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div>
                      {User.name === rev.userName ? (
                        <button
                          onClick={() => {
                            setcommentObj(rev);
                            setedit(index);
                          }}
                          className="edit"
                        >
                          <FaEdit />
                        </button>
                      ) : (
                        ''
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default MoreDetails;
