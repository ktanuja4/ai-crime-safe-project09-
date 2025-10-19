
import React from 'react';
import footerback from "../images/image2.png";
import crimeweblogo from "../images/crimeweb-logo-white.png";
import { FaFacebook, FaTwitter, FaInstagram ,FaYoutube} from 'react-icons/fa';
import "../Styles/footer.css";

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com', icon: FaFacebook },
  { name: 'Twitter', href: 'https://twitter.com', icon: FaTwitter },
  { name: 'Instagram', href: 'https://instagram.com', icon: FaInstagram },
  { name: 'YouTube', href: 'https://youtube.com', icon: FaYoutube },
];

const Footer = () => {
  return (
    <footer id="contact">
      <div className="footer-background" style={{ backgroundImage: `url(${footerback})` }}>
        <div className="container">
          <section className="section6">
            <h1 className="logo-text">AI CrimeSafe</h1>
            <p>web-based platforms and services related to criminal activity or the fictional crime</p>
          </section>
          <section className="contactus">
            <h3>Contact Us</h3>
            <p>Email: <a href="mailto:Support@crime-detect.com">Support@crime-detect.com</a></p>
            <p>Phone: <a href="tel:9876543210">9876543210</a></p>
            <p>Address: #New Delhi</p>
          </section>
          <section className="socialmedia">
            <h3>Follow Us</h3>  
            <div className="social-links-container">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <p key={name}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={name}>
                    <Icon />
                    <span>{name}</span>
                  </a>
                </p>
              ))}
            </div>
          </section>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 CrimeWeb. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer