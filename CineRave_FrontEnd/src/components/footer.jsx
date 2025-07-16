import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa';
import './footer.css';
const Footer = () => {
  return (
    <footer>
      <ul className="footer-icons" id="footer">
        <li>
          <FaFacebook />
        </li>
        <li>
          <FaInstagram />
        </li>
        <li>
          <FaTwitter />
        </li>
        <li>
          <FaLinkedin />
        </li>
        <li>
          <FaGithub />
        </li>
      </ul>
      <p className="copyright">© 2025 CineRave. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
