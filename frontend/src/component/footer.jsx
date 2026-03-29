import { Link } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaShieldAlt, FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-black border-t border-yellow-500/10 text-gray-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              SafeStream <span className="text-yellow-400">Platform</span>
            </h2>
            <p className="mt-4 text-sm leading-6 text-gray-400">
              SafeStream is an AI-powered content moderation platform that helps
              detect toxic text, inappropriate images, and potentially harmful
              content for a safer digital experience.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
                <FaShieldAlt />
              </span>
              <p className="text-sm text-gray-300">
                Smart moderation with a secure and modern workflow
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-yellow-400 font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-yellow-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/feed" className="hover:text-yellow-400 transition">
                  Feed
                </Link>
              </li>
              <li>
                <Link to="/create-post" className="hover:text-yellow-400 transition">
                  Create Post
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-yellow-400 transition">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-yellow-400 transition">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-yellow-400 transition">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Features */}
          <div>
            <h3 className="text-yellow-400 font-semibold text-lg mb-4">
              Features
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-yellow-400 transition cursor-default">
                Toxicity Detection
              </li>
              <li className="hover:text-yellow-400 transition cursor-default">
                NSFW Image Detection
              </li>
              <li className="hover:text-yellow-400 transition cursor-default">
                AI-powered Moderation
              </li>
              <li className="hover:text-yellow-400 transition cursor-default">
                Approved Content Feed
              </li>
              <li className="hover:text-yellow-400 transition cursor-default">
                Moderator Dashboard
              </li>
            </ul>
          </div>

          {/* Contact / Social */}
          <div>
            <h3 className="text-yellow-400 font-semibold text-lg mb-4">
              Contact
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-yellow-400" />
                <span>amansoni0228@gmail.com</span>
              </div>

              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-yellow-400" />
                <span>+91 8736853330</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-white font-medium mb-3">Follow Us</h4>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 hover:bg-yellow-500 hover:text-black transition"
                >
                  <FaGithub />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 hover:bg-yellow-500 hover:text-black transition"
                >
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-5 border-t border-yellow-500/10 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>
            © 2026 <span className="text-yellow-400 font-medium">SafeStream</span>. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-yellow-400 transition">
              Privacy
            </Link>
            <Link to="/" className="hover:text-yellow-400 transition">
              Terms
            </Link>
            <Link to="/" className="hover:text-yellow-400 transition">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;