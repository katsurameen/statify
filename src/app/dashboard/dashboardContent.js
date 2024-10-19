"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Skeleton from "../components/skeleton"; // Adjust the import path if necessary

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const access_token = searchParams.get("access_token");
  const refresh_token = searchParams.get("refresh_token");

  const [data, setData] = useState({ tracks: [], artists: [], genres: [] });
  const [userProfile, setUserProfile] = useState(null); // For user profile data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllArtists, setShowAllArtists] = useState(false);

  // Toggle the logout popup visibility
  const toggleLogoutPopup = () => {
    setShowLogoutPopup((prevState) => !prevState);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
      });
      if (res.ok) {
        // Redirect or take action after logout
        window.location.href = '/'; // Redirect to login page or any other route
      } else {
        console.error('Failed to logout');
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${access_token}` };

        // Fetch top tracks, top artists, and user profile
        const [tracksRes, artistsRes, profileRes] = await Promise.all([
          fetch("https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5", { headers }),
          fetch("https://api.spotify.com/v1/me/top/artists?time_range=long_term", { headers }),
          fetch("https://api.spotify.com/v1/me", { headers }) // Fetch user profile
        ]);

        if (tracksRes.status === 401) {
          // Token expired; refresh it
          const refreshRes = await fetch("/api/refresh", {
            method: "POST",
            body: JSON.stringify({ refresh_token }),
            headers: { "Content-Type": "application/json" },
          });

          const newTokenData = await refreshRes.json();
          router.replace(
            `/dashboard?access_token=${newTokenData.access_token}&refresh_token=${refresh_token}`
          );
          return;
        }

        const tracksData = await tracksRes.json();
        const artistsData = await artistsRes.json();
        const profileData = await profileRes.json(); // Parse user profile data

        // Extract genres from top artists instead of tracks
        const genreCounts = {};
        for (const artist of artistsData.items) {
        const artistGenres = artist.genres; // Get the genres for this artist
        
        // Check if artistGenres is an array before iterating
        if (Array.isArray(artistGenres)) {
            for (const genre of artistGenres) {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            }
        } else {
            console.warn(`Artist ${artist.name} does not have valid genres:`, artistGenres);
        }
        }

        const totalGenres = Object.values(genreCounts).reduce((acc, count) => acc + count, 0);
        const genreFrequencies = Object.entries(genreCounts)
        .map(([genre, count]) => ({
            genre,
            frequency: (count / totalGenres) * 100 // Frequency in percentage
        }))
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 6); // Get the top 6 genres

        // Ensure the frequencies sum to 100% for display purposes
        const adjustedGenres = genreFrequencies.map((genre, index) => ({
        ...genre,
        frequency: index === genreFrequencies.length - 1 
            ? 100 - genreFrequencies.slice(0, -1).reduce((acc, g) => acc + g.frequency, 0) // Adjust the last genre
            : genre.frequency
        }));

        setData({ tracks: tracksData, artists: artistsData, genres: adjustedGenres });
        setUserProfile(profileData); // Set user profile data
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [access_token, refresh_token, router]);

  if (loading) {
    return (
      <div className="p-4" style={{ backgroundColor: "#212121" }}>
        <header className="sticky top-0 z-10 mb-6" style={{ backgroundColor: "#212121" }}>
          <div className="flex items-center justify-between">
            <h1 style={{ color: "#FFFFFF" }} className="text-4xl font-bold">
              stati<span style={{ color: "#1DB954" }}>fy</span>.
            </h1>
            {/* Skeleton for User Profile Image */}
            <Skeleton height="50px" width="50px" borderRadius="50%" />
          </div>
        </header>

        {/* Skeleton Loader for Top Tracks */}
        <section>
          <h2 className="text-xl mb-2" style={{ color: "#1DB954" }}>Top Tracks</h2>
          <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: "#292929" }}>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center mb-2">
                <Skeleton height="30px" width="30px" borderRadius="50%" style={{ marginRight: "1rem" }} />
                <div>
                  <Skeleton height="20px" width="80%" />
                  <Skeleton height="15px" width="60%" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skeleton Loader for Top Artists */}
        <section>
          <h2 className="text-xl mb-2" style={{ color: "#1DB954" }}>Top Artists</h2>
          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg mb-6" style={{ backgroundColor: "#292929" }}>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <Skeleton height="100px" width="100px" borderRadius="50%" />
                <Skeleton height="20px" width="70%" />
              </div>
            ))}
          </div>
        </section>

        {/* Skeleton Loader for Top Genres */}
        <section>
          <h2 className="text-xl mb-2" style={{ color: "#1DB954" }}>Top Genres</h2>
          <div className="p-4 rounded-lg" style={{ backgroundColor: "#292929" }}>
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} height="20px" width="80%" />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="p-4" style={{ backgroundColor: "#212121", fontFamily: 'K2D' }}>
      <header className="sticky top-0 z-10 mb-4 pt-3 pb-3" style={{ backgroundColor: "#212121" }}>
        <div className="flex items-center justify-between">
          <h1 style={{ color: "#FFFFFF" }} className="text-5xl font-extrabold">
            stati<span style={{ color: "#1DB954" }}>fy</span>.
          </h1>
          {/* Display the user profile image in the top-right corner */}
          {/* Profile picture with click event */}
          {userProfile && userProfile.images.length > 0 && (
            <div className="relative">
              <img
                src={userProfile.images[0].url} // Get the first image URL
                alt="User Profile"
                className="w-10 h-10 rounded-full border-2 border-white cursor-pointer" // Add cursor pointer for clickable
                onClick={toggleLogoutPopup} // Toggle the popup
              />
              
              {/* Logout popup */}
              {showLogoutPopup && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg z-20"
                  style={{ border: '1px solid #1DB954' }}
                >
                  <div className="p-4">
                    <p className="mb-2">Are you sure you want to logout?</p>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <section>
        <h2 className="text-xl mb-2 font-extrabold" style={{ color: "#1DB954", fontFamily: 'K2D' }}>Top tracks</h2>
        <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: "#292929" }}>
          {data.tracks.items.map((track, index) => (
            <div key={track.id} className="flex items-center mb-2">
              <span className="text-3xl font-bold mr-4" style={{ color: "#1DB954" }}>
                {index + 1}
              </span>
              <div>
                <p className="text-lg" style={{ color: "#1DB954" }}>{track.name}</p>
                <p className="text-sm" style={{ color: "#FFFFFF" }}>
                  {track.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
  <div className="flex justify-between items-center mb-2">
    <h2 className="text-xl font-extrabold" style={{ color: "#1DB954", fontFamily: 'K2D' }}>Top artists</h2>
    <button 
      className="text-sm" 
      style={{ color: "#2B7C48FF" }} 
      onClick={() => setShowAllArtists((prev) => !prev)}
    >
      {showAllArtists ? 'Show Less' : 'Show More'}
    </button>
  </div>

  <div className="grid grid-cols-3 gap-1 p-1 rounded-lg mb-6">
    {data.artists.items
      .slice(0, showAllArtists ? data.artists.items.length : 3)
      .map((artist) => (
        <div key={artist.id} className="flex flex-col items-center">
          <img
            src={artist.images[0]?.url}
            alt={artist.name}
            className="w-24 h-24 square rounded-md"
          />
          <p className="text-sm text-center" style={{ color: "#1DB954" }}>{artist.name}</p>
        </div>
      ))
    }
  </div>
</section>


      <section>
  <h2 className="text-xl mb-2 font-extrabold" style={{ color: "#1DB954", fontFamily: 'K2D' }}>
    Top Genres
  </h2>
  <div className="p-4 rounded-lg space-y-2" style={{ backgroundColor: "#292929" }}>
    {data.genres
      .sort((a, b) => b.frequency - a.frequency) // Sort genres from largest to smallest
      .map((genre, index) => (
        <div
          key={index}
          className="text-white px-2 py-1 rounded-lg"
          style={{
            width: `${genre.frequency}%`,
            backgroundColor: "#1DB954",
            // minWidth: '400px',
            height: '35px',
            maxWidth: '100%', // Ensure it doesn't exceed the container width
            // flexGrow: 1, // Allow the divs to grow
            whiteSpace: 'nowrap', // Prevent text from wrapping
            overflow: 'visible', // Allow text to overflow
            textOverflow: 'ellipsis', // Add ellipsis if text overflows (optional)
          }}
        >
          {genre.genre}  {/* - {genre.frequency.toFixed(2)}% Display to two decimal places */}
        </div>
      ))}
  </div>
</section>



      
    </div>
  );
}
