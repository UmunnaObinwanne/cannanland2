"use client";

import { motion } from "framer-motion";

import { CtaButton } from "@/components/cta-button";

export function Hero() {
  return (
    <section className="pb-28 pt-20 bg-gradient-to-b from-background via-70% via-accent/30">
      <div className="container flex flex-col items-center gap-8 sm:gap-10">
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: 5, opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="flex cursor-pointer items-center gap-1 rounded-full bg-secondary hover:bg-secondary/60 text-primary px-4 font-medium py-1"
        >
          <span className="text-sm">Introducing Cannanland</span>
        </motion.div>
       <motion.h1
  animate={{ y: 0, opacity: 1 }}
  initial={{ y: 10, opacity: 0 }}
  transition={{ delay: 0, duration: 0.4 }}
  className="text-center font-heading text-4xl sm:text-5xl tracking-tight lg:text-6xl text-balance font-bold"
>
  The community to connect and 
  <span className="px-4">grow</span> 
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
    your spiritual life
  </span>
</motion.h1>
        <motion.p
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: 10, opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="max-w-lg text-center text-lg text-muted-foreground sm:text-xl"
        >
          Leave a prayer request, share the word of God, ask spiritual questions, gain biblical
          insights from fellow seasoned Christians.
        </motion.p>
        <motion.div
          animate={{ y: 0.4, opacity: 1 }}
          initial={{ y: 10, opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex"
        >
          <CtaButton href="#" text="What do you want to share?" />
        </motion.div>
      </div>
    </section>
  );
}
