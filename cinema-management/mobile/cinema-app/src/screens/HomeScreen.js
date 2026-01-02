import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  };

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8 bg-white min-h-screen">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            Welcome to TravelGo
          </h1>

          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Welcome to our project where you can visit all Moroccan cities and buy your reservation now through our management platform.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={() => navigation.navigate('Movies')}
              className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Manage Movies
            </button>

            <button
              onClick={() => navigation.navigate('Reservations')}
              className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
            >
              View Reservations <span aria-hidden="true">→</span>
            </button>
          </div>
          <div className="mt-10">
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 hover:text-red-500 underline underline-offset-4"
            >
              Logout of Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;