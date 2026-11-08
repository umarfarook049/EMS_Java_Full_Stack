import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"; // Importing social icons

const FooterComponent = () => {
  return (
    <div className="mt-auto">
      <footer className="footer ft text-white py-3">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <span>
                Copyright &#169; 2024{" "}
                <a
                  href="https://umarsportfolio.com"
                  className="text-white font-weight-bold"
                  style={{ textDecoration: "none" }}
                >
                  ems.com
                </a>{" "}
                | All rights reserved
              </span>
            </div>
            <div className="col-12 text-center mt-3">
              <a
                href="https://github.com/umarfarook049"
                className="text-white mx-2"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/umar-farook-68b78a248/"
                className="text-white mx-2"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://twitter.com/username"
                className="text-white mx-2"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FooterComponent;
