"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react"; // Added useCallback and useRef

import { cn } from "@/lib/utils"; // Ensure this exists or replace with `clsx` or remove

export interface ContainerTextFlipProps {
  animationDuration?: number; // Duration of the width animation and character reveal
  className?: string; // Class for the main container
  interval?: number; // Time between word changes
  textClassName?: string; // Class for the animating text itself
  words?: string[]; // Array of words to cycle through
}

export function ContainerTextFlip({
  animationDuration = 700, // Default animation duration for smooth transitions
  className,
  interval = 3000, // Default interval between word changes
  textClassName,
  words = ["better", "modern", "beautiful", "awesome"], // Default words
}: ContainerTextFlipProps) {
  const id = useId(); // Unique ID for layout animations
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0); // State for the dynamic width of the container
  const textContentRef = useRef<HTMLDivElement | null>(null); // Ref for measuring the actual text content

  // 1. Wrap updateWidthForWord in useCallback to stabilize its reference
  const updateWidthForWord = useCallback(() => {
    if (textContentRef.current) {
      // Use scrollWidth to get the full content width, and add some padding
      const measuredWidth = textContentRef.current.scrollWidth;
      // Add a small buffer to prevent text from being cut off, or ensure padding in CSS
      setContainerWidth(measuredWidth + 30); // Added 30px buffer for a bit of space
    }
  }, []); // No dependencies needed, as it only reads from the ref

  // 2. Effect to update width when the word changes or on initial mount
  // This effect depends on currentWordIndex to re-measure when a new word is displayed,
  // and on updateWidthForWord (which is now stable) to ensure it runs correctly.
  useEffect(() => {
    // A small timeout ensures the text content is rendered before measuring
    // This can help with initial measurement accuracy.
    const timeoutId = setTimeout(() => {
      updateWidthForWord();
    }, 50); // Delay slightly for rendering to settle
    return () => clearTimeout(timeoutId);
  }, [updateWidthForWord]); // Recalculate width when the word changes

  // 3. Effect to handle word rotation (interval logic)
  useEffect(() => {
    if (words.length === 0) return; // Prevent errors if words array is empty

    const intervalId = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(intervalId); // Cleanup on unmount or dependency change
  }, [words, interval]); // Dependencies: words array and interval duration

  // Use the current word
  const currentWord = words[currentWordIndex];

  return (
    <motion.p
      // Using key for the main motion.p helps React understand content has changed,
      // which can be useful for certain animation patterns, though layoutId is often sufficient.
      key={currentWord}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-lg px-6 py-3 font-bold text-4xl text-black md:text-7xl dark:text-white", // Added padding for better appearance
        "shadow-[inset_0_-1px_#d1d5db,inset_0_0_0_1px_#d1d5db,_0_4px_8px_#d1d5db] [background:linear-gradient(to_bottom,#f3f4f6,#e5e7eb)]",
        "dark:shadow-[inset_0_-1px_#10171e,inset_0_0_0_1px_hsla(205,89%,46%,.24),_0_4px_8px_#00000052] dark:[background:linear-gradient(to_bottom,#374151,#1f2937)]",
        className
      )}
      // Animate the container's width based on the measured word width
      animate={{ width: containerWidth }}
      layoutId={`words-here-${id}`} // Unique ID for layout transitions
      transition={{ duration: animationDuration / 1000 }} // Duration of the width animation
      layout // Enable automatic layout animations
    >
      <motion.div
        ref={textContentRef} // Attach ref to the div containing the actual text
        className={cn(
          "absolute inset-0 flex items-center justify-center whitespace-nowrap",
          textClassName
        )} // Position div to correctly measure content
        layoutId={`word-div-${currentWord}-${id}`} // Unique ID for the animating word's layout
        transition={{
          duration: animationDuration / 1000,
          ease: "easeInOut",
        }}
      >
        {/* Animate each letter individually */}
        <motion.div>
          {currentWord.split("").map((letter, index) => (
            <motion.span
              key={index} // Use index as key here, or combine with letter for uniqueness if letters repeat
              animate={{ filter: "blur(0px)", opacity: 1 }}
              initial={{ filter: "blur(10px)", opacity: 0 }}
              transition={{ delay: index * 0.03, duration: 0.15 }} // Slightly adjusted delay and added duration for subtle effect
              className="inline-block" // Ensure span behaves as inline-block for proper spacing
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.p>
  );
}
