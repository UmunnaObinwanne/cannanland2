"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { FaPrayingHands, FaBible, FaCommentAlt, FaBars, FaChartLine, FaQuestion } from "react-icons/fa";
import { useState, useCallback, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/supabase/types";
import { useRouter } from 'next/navigation';
import { LoadingModal } from "@/components/loading-modal";
import { toast } from 'sonner';

interface HeaderClientProps {
  user: User | null;
  isAdmin: boolean;
}

// Separate navigation link components for better performance
const NavLink = memo(({ href, icon: Icon, children }: { 
  href: string; 
  icon: typeof FaPrayingHands; 
  children: React.ReactNode; 
}) => (
  <Link
    href={href}
    className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900"
  >
    <Icon className="text-blue-500 text-sm sm:text-base" />
    {children}
  </Link>
));

NavLink.displayName = 'NavLink';

export function HeaderClient({ user, isAdmin }: HeaderClientProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    async function loadProfile() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*, is_admin')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProfile();
  }, [user]);

  const handleSignOut = useCallback(async () => {
    try {
      setIsSigningOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      router.refresh();
    } catch (error) {
      toast.error('Error signing out');
    } finally {
      setIsSigningOut(false);
    }
  }, [router]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const renderAuthSection = useCallback(() => {
    if (user) {
      return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-gray-600">
            Hey, {profile?.full_name || user.email}!
          </span>
          <Link
            href="/user-profile"
            className="group flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transition-transform group-hover:scale-110"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <span>View Profile</span>
          </Link>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all
              ${isSigningOut 
                ? 'cursor-not-allowed bg-gray-400 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
          >
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      );
    }

    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }, [user, profile, isSigningOut, handleSignOut]);

  if (isLoading) {
    return <LoadingModal />;
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white shadow-md"
    >
      {/* Top Bar */}
      <div className="container py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Logo />
          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <FaChartLine className="text-sm" />
                <span>Admin Dashboard</span>
              </Link>
            )}
            {renderAuthSection()}
          </div>
          {/* Mobile Hamburger */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={toggleMenu}
          >
            <FaBars className="text-xl text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-gray-200">
          <div className="container py-4">
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <FaChartLine className="text-sm" />
                <span>Admin Dashboard</span>
              </Link>
            )}
            {renderAuthSection()}
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <div className="container py-4">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          {/* Share Section */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <h2 className="text-base lg:text-lg font-semibold text-gray-700">Share:</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
              <NavLink href="/share-prayer-request" icon={FaPrayingHands}>
                Prayer Requests
              </NavLink>
              <NavLink href="/share-bible-study" icon={FaBible}>
                Bible Study
              </NavLink>
              <NavLink href="/share-testimony" icon={FaCommentAlt}>
                Testimonies
              </NavLink>
              <NavLink href="/share-spiritual-question" icon={FaQuestion}>
                Spiritual Questions
              </NavLink>
            </div>
          </div>

          {/* View Section */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <h2 className="text-base lg:text-lg font-semibold text-gray-700">View:</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
              <NavLink href="/prayer-requests" icon={FaPrayingHands}>
                Prayer Requests
              </NavLink>
              <NavLink href="/bible-studies" icon={FaBible}>
                Bible Study
              </NavLink>
              <NavLink href="/testimonies" icon={FaCommentAlt}>
                Testimonies
              </NavLink>
              <NavLink href="/spiritual-questions" icon={FaQuestion}>
                Spiritual Questions
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}