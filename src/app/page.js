// src/app/page.js
"use client";
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importing Font Awesome

export default function Home() {
  const handleLogin = () => {
    // Redirect to the API route that handles Spotify login
    window.location.href = "/api/login";
  };

  return (
    <div className="flex items-center justify-center min-h-screen content-center" style={{ backgroundColor: "#212121" }}>
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-2">
          stati<span className="text-green-500" style={{ color: "#1DB954" }}>fy</span>.
        </h1>
        <p className="text-gray-400 mb-8">Get statistics about your Spotify!</p>
        <button
          onClick={handleLogin}
          className="text-white font-bold py-2 px-4 rounded-full flex items-center justify-center ml-3.5
                     transition-transform transform active:scale-95 duration-150 ease-in-out"
                     style={{ backgroundColor: "#1DB954" }}
        >
          <i className="fab fa-spotify text-2xl mr-2"></i>
          Login with Spotify
        </button>
      </div>
    </div>
  );
}


{/* <p key={index} className="text-lg mb-2" style={{ color: "#1DB954" }}>
            
          </p>

<div key={item.genre} className="bg-green-500 text-black px-2 py-1 rounded-lg">
<div className={${item.width} bg-green-500}>{item.genre}</div>
</div> */}