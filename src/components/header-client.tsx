// HeaderClient.tsx (Client Component)
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { FaPrayingHands, FaBible, FaCommentAlt, FaBars } from "react-icons/fa";
import { useState, useEffect, use } from "react";
import { User } from "@supabase/supabase-js";
import { getUserProfile, signOutAction } from "@/app/actions";
import Image from "next/image";
import { createClient } from "../../utils/supabase/client";
import { Profile } from "../../utils/supabase/types";
import { redirect } from "next/navigation";

interface HeaderClientProps {
  user: User | null;
}

export function HeaderClient({ user }: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (user) {
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error loading profile:', error);
            return;
          }
          
          if (data) {
            setProfile(data);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
    
    loadProfile();
  }, [user]);
  

  const renderAuthSection = () => {
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
          <form action={signOutAction} className="w-full sm:w-auto">
            <Button type="submit" variant="outline" size="sm" className="w-full sm:w-auto">
              Sign out
            </Button>
          </form>
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
  };

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="w-full bg-white shadow-md"
    >
      {/* Top Bar */}
      <div className="container py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Logo />
          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {renderAuthSection()}
          </div>
          {/* Mobile Hamburger */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars className="text-xl text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-gray-200">
          <div className="container py-4">
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
              <Link
                href="/share-prayer-request"
                className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900"
              >
                <FaPrayingHands className="text-blue-500 text-sm sm:text-base" />
                Prayer Requests
              </Link>
              <Link
                href="/share-bible-study"
                className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900"
              >
                <FaBible className="text-green-500 text-sm sm:text-base" />
                Bible Study
              </Link>
              <Link
                href="/share-testimony"
                className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900"
              >
                <FaCommentAlt className="text-purple-500 text-sm sm:text-base" />
                Testimonies
              </Link>
            </div>
          </div>

          {/* View Section */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <h2 className="text-base lg:text-lg font-semibold text-gray-700">View:</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
              <Link
                href="/prayer-requests"
                className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900"
              >
                <FaPrayingHands className="text-blue-500 text-sm sm:text-base" />
                Prayer Requests
              </Link>
              <Link
                href="/bible-studies"
                className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900"
              >
                <FaBible className="text-green-500 text-sm sm:text-base" />
                Bible Studies
              </Link>
              <Link
                href="/testimonies"
                className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900"
              >
                <FaCommentAlt className="text-purple-500 text-sm sm:text-base" />
                Testimonies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}