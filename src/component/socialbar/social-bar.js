import { FaFacebook, FaTwitter, FaGoogle, FaLinkedin, FaYoutube,FaWhatsapp,FaInstagram } from 'react-icons/fa';
import "../socialbar/bar.css"

const SocialBar = () => {
  return (
    <div className="icon-bar" style={{ transform: 'translateY(-50%)', width: '80px', marginLeft: '-120px', padding:'0' }}>
      <a href="#" className="facebook"><FaFacebook style={{ fontSize: '22px' }} /></a>
      <a href="#" className="twitter"><FaTwitter style={{ fontSize: '22px' }} /></a>
      <a href="#" className="google"><FaGoogle style={{ fontSize: '22px' }} /></a>
      <a href="#" className="linkedin"><FaLinkedin style={{ fontSize: '22px' }} /></a>
      <a href="#" className="youtube"><FaYoutube style={{ fontSize: '22px' }} /></a>
      <a href="#" className="whatsapp"><FaWhatsapp style={{ fontSize: '22px' }} /></a>
      <a href="#" className="instagram"><FaInstagram style={{ fontSize: '22px' }} /></a>
    </div>
  );
}

export default SocialBar;

