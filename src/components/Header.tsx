import { Bell, ChevronDown, LogOut, Menu, User, X } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import userAvatar from '@/assets/images/user-avatar.png';
import logo from '@/assets/images/logo.svg';

import { getUser, removeToken, removeUser } from '@/utils/storage';

interface HeaderProps {
  onMenuClick: () => void;
  mobileSidebarOpen: boolean;
}

function Header({ onMenuClick, mobileSidebarOpen }: HeaderProps) {
  const navigate = useNavigate();

  const [notificationOpen, setNotificationOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  /* =========================================================
     GET LOGGED-IN USER
  ========================================================= */

  const user = getUser();

  const userName = typeof user?.name === 'string' ? user.name.trim() : 'User';

  const userRole = typeof user?.role === 'string' ? user.role.trim() : 'User';

  const notificationRef = useRef<HTMLDivElement>(null);

  const profileRef = useRef<HTMLDivElement>(null);

  /* =========================================================
     CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setNotificationOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /* =========================================================
     CLOSE DROPDOWNS WHEN MOBILE SIDEBAR OPENS
  ========================================================= */

  useEffect(() => {
    if (mobileSidebarOpen) {
      setNotificationOpen(false);
      setProfileOpen(false);
    }
  }, [mobileSidebarOpen]);

  /* =========================================================
     NOTIFICATION TOGGLE
  ========================================================= */

  const handleNotificationToggle = () => {
    setNotificationOpen((previous) => !previous);

    setProfileOpen(false);
  };

  /* =========================================================
     PROFILE TOGGLE
  ========================================================= */

  const handleProfileToggle = () => {
    setProfileOpen((previous) => !previous);

    setNotificationOpen(false);
  };

  /* =========================================================
     MY PROFILE
  ========================================================= */

  const handleMyProfile = () => {
    setProfileOpen(false);

    /*
     * Profile page/API is not part of
     * the currently provided application flow.
     *
     * Add navigation here once that route
     * is implemented.
     */
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    setProfileOpen(false);

    removeToken();
    removeUser();

    navigate('/login', {
      replace: true,
    });
  };

  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-[72px]
        items-center
        justify-between
        border-b
        border-[#E4E7EC]
        bg-white
        px-4
        sm:h-[80px]
        sm:px-5
        lg:h-[92px]
        lg:justify-end
        lg:px-6
      "
    >
      {/* =====================================================
          MOBILE / TABLET LEFT SECTION
      ====================================================== */}

      <div className="flex items-center gap-3 lg:hidden">
        {/* Mobile menu */}

        <button
          type="button"
          onClick={onMenuClick}
          aria-label={mobileSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileSidebarOpen}
          className="
            flex
            h-10
            w-10
            cursor-pointer
            items-center
            justify-center
            rounded-lg
            text-[#344054]
            outline-none
            transition
            hover:bg-[#F8F9FC]
            focus-visible:ring-2
            focus-visible:ring-[#315BEF]/30
            sm:h-11
            sm:w-11
          "
        >
          {mobileSidebarOpen ? (
            <X size={22} strokeWidth={1.8} />
          ) : (
            <Menu size={22} strokeWidth={1.8} />
          )}
        </button>

        {/* Mobile logo */}

        <img
          src={logo}
          alt="Preproute"
          className="
            h-auto
            w-[118px]
            object-contain
            sm:w-[130px]
          "
        />
      </div>

      {/* =====================================================
          RIGHT SECTION
      ====================================================== */}

      <div className="flex items-center gap-2 sm:gap-4 lg:gap-5">
        {/* =================================================
            NOTIFICATIONS
        ================================================== */}

        <div ref={notificationRef} className="relative">
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notificationOpen}
            onClick={handleNotificationToggle}
            className="
              relative
              flex
              h-10
              w-10
              cursor-pointer
              items-center
              justify-center
              rounded-full
              border
              border-[#D0D5DD]
              bg-white
              outline-none
              transition
              hover:bg-[#F8F9FC]
              focus-visible:ring-2
              focus-visible:ring-[#315BEF]/30
              sm:h-11
              sm:w-11
              lg:h-12
              lg:w-12
            "
          >
            <Bell
              size={20}
              strokeWidth={1.8}
              className="
                text-[#344054]
                sm:size-[21px]
                lg:size-[22px]
              "
            />

            {/* Notification indicator */}

            <span
              aria-hidden="true"
              className="
                absolute
                right-[7px]
                top-[7px]
                h-2
                w-2
                rounded-full
                bg-[#12B76A]
                sm:right-[8px]
                sm:top-[8px]
                sm:h-[9px]
                sm:w-[9px]
              "
            />
          </button>

          {/* Notification dropdown */}

          {notificationOpen && <NotificationDropdown />}
        </div>

        {/* =================================================
            USER PROFILE
        ================================================== */}

        <div ref={profileRef} className="relative">
          <button
            type="button"
            aria-label="Open user menu"
            aria-expanded={profileOpen}
            onClick={handleProfileToggle}
            className="
              flex
              cursor-pointer
              items-center
              gap-2
              rounded-lg
              px-1
              py-1
              outline-none
              transition
              hover:bg-[#F8F9FC]
              focus-visible:ring-2
              focus-visible:ring-[#315BEF]/30
              sm:gap-3
            "
          >
            {/* Avatar */}

            <img
              src={userAvatar}
              alt={userName}
              title={userName}
              className="
                h-9
                w-9
                rounded-full
                object-cover
                sm:h-10
                sm:w-10
                lg:h-[50px]
                lg:w-[50px]
              "
            />

            {/* Desktop user information */}

            <div className="hidden min-w-0 text-left sm:block">
              <p
                title={userName}
                className="
                  max-w-[180px]
                  truncate
                  text-[18px]
                  font-semibold
                  leading-6
                  text-[#344054]
                  xl:text-[20px]
                "
              >
                {userName}
              </p>

              <p className="mt-1 text-[13px] capitalize leading-5 text-[#475467]">{userRole}</p>
            </div>

            {/* Dropdown icon */}

            <ChevronDown
              size={16}
              strokeWidth={1.8}
              className={`
                hidden
                text-[#344054]
                transition-transform
                sm:block
                ${profileOpen ? 'rotate-180' : ''}
              `}
            />
          </button>

          {/* Profile dropdown */}

          {profileOpen && (
            <ProfileDropdown
              userName={userName}
              userRole={userRole}
              onProfile={handleMyProfile}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   NOTIFICATION DROPDOWN
========================================================= */

function NotificationDropdown() {
  return (
    <div
      className="
        absolute
        right-0
        top-[50px]
        z-50
        w-[calc(100vw-32px)]
        max-w-[360px]
        overflow-hidden
        rounded-xl
        border
        border-[#E4E7EC]
        bg-white
        shadow-[0_8px_24px_rgba(16,24,40,0.12)]
        sm:top-[56px]
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between gap-3 border-b border-[#E4E7EC] px-4 py-3">
        <h3 className="text-[14px] font-semibold text-[#344054]">Notifications</h3>

        <button
          type="button"
          className="
            cursor-pointer
            whitespace-nowrap
            text-[11px]
            font-medium
            text-[#5B8DEF]
            hover:underline
            sm:text-[12px]
          "
        >
          Mark all as read
        </button>
      </div>

      {/* Notification list */}

      <div className="max-h-[360px] overflow-y-auto">
        <NotificationItem
          title="Test published successfully"
          description="English Diagnostics 101 is now live."
          time="5 min ago"
          unread
        />

        <NotificationItem
          title="New test created"
          description="A new test has been added to your dashboard."
          time="30 min ago"
        />

        <NotificationItem
          title="Test scheduled"
          description="Algebraic Formulas II is scheduled."
          time="1 hour ago"
        />
      </div>

      {/* Footer */}

      <div className="border-t border-[#E4E7EC] px-4 py-3 text-center">
        <button
          type="button"
          className="
            cursor-pointer
            text-[13px]
            font-medium
            text-[#5B8DEF]
            hover:underline
          "
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   NOTIFICATION ITEM
========================================================= */

interface NotificationItemProps {
  title: string;
  description: string;
  time: string;
  unread?: boolean;
}

function NotificationItem({ title, description, time, unread = false }: NotificationItemProps) {
  return (
    <button
      type="button"
      className="
        flex
        w-full
        cursor-pointer
        gap-3
        border-b
        border-[#F2F4F7]
        px-4
        py-4
        text-left
        transition
        hover:bg-[#F9FAFB]
      "
    >
      <div className="relative mt-1 shrink-0">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF4FF]">
          <Bell size={16} className="text-[#5B8DEF]" />
        </span>

        {unread && (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#12B76A]" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p title={title} className="truncate text-[13px] font-semibold text-[#344054]">
            {title}
          </p>

          {unread && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#12B76A]" />}
        </div>

        <p title={description} className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#667085]">
          {description}
        </p>

        <p className="mt-1.5 text-[11px] text-[#98A2B3]">{time}</p>
      </div>
    </button>
  );
}

/* =========================================================
   PROFILE DROPDOWN
========================================================= */

interface ProfileDropdownProps {
  userName: string;
  userRole: string;
  onProfile: () => void;
  onLogout: () => void;
}

function ProfileDropdown({ userName, userRole, onProfile, onLogout }: ProfileDropdownProps) {
  return (
    <div
      className="
        absolute
        right-0
        top-[50px]
        z-50
        w-[230px]
        overflow-hidden
        rounded-xl
        border
        border-[#E4E7EC]
        bg-white
        shadow-[0_8px_24px_rgba(16,24,40,0.12)]
        sm:top-[56px]
      "
    >
      {/* Greeting */}

      <div className="border-b border-[#E4E7EC] px-4 py-3.5">
        <p title={userName} className="truncate text-[13px] font-medium text-[#667085]">
          Hello, {userName}!
        </p>
      </div>

      {/* Menu */}

      <div className="p-2">
        <button
          type="button"
          disabled
          className="
    flex
    w-full
    cursor-not-allowed
    items-center
    justify-between
    gap-3
    rounded-lg
    px-3
    py-2.5
    text-left
    text-[13px]
    font-medium
    text-[#98A2B3]
    opacity-70
  "
        >
          <span className="flex items-center gap-3">
            <User size={17} strokeWidth={1.8} />

            <span>My Profile</span>
          </span>

          <span
            className="
      rounded-full
      bg-[#F2F4F7]
      px-2
      py-0.5
      text-[10px]
      font-medium
      text-[#667085]
    "
          >
            Soon
          </span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="
            flex
            w-full
            cursor-pointer
            items-center
            gap-3
            rounded-lg
            px-3
            py-2.5
            text-left
            text-[13px]
            font-medium
            text-[#D92D20]
            outline-none
            transition
            hover:bg-[#FEF3F2]
            focus-visible:ring-2
            focus-visible:ring-[#F04438]/30
          "
        >
          <LogOut size={17} strokeWidth={1.8} />

          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Header;
