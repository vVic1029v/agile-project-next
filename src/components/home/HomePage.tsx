import React from 'react';
import Link from 'next/link';
import BigButton from '../Common/Buttons/BigButton';
import AnimatedHeader from '../Common/Headers/AnimatedHeader';

const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center gap-12 bg-cover bg-center bg-[url('/uploads/frontyard.webp')]">
      {/* Layer pentru întunecare */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Conținutul principal */}
      <div className="relative z-10 text-white">
        <AnimatedHeader text={"Welcome to Your Calendar Dashboard"} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
          <Link href="/calendar" passHref>
            <BigButton
              iconPath="M8 7V3M16 7V3M4 11h16M4 19h16M4 15h16"
              label="Calendar"
              delay={0.2}
            />
          </Link>
          <Link href="/myclass" passHref>
            <BigButton
              iconPath="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
              label="Homeclass"
              delay={0.4}
            />
          </Link>
          <Link href="/announcements" passHref>
            <BigButton
              iconPath="M11 5l6-3v16l-6-3H5a2 2 0 01-2-2V7a2 2 0 012-2h6zM19 9v6M15 12h4"
              label="Announcements"
              delay={0.6}
            />
          </Link>
          <Link href="/myaccount" passHref>
            <BigButton
              iconPath="M12 2C10.343 2 9 3.343 9 5s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM4 20c0-3.313 4-4 8-4s8 .687 8 4"
              label="My account"
              delay={0.8}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
