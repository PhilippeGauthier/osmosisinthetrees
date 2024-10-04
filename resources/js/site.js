import Alpine from "alpinejs";
import collapse from "@alpinejs/collapse";
import focus from "@alpinejs/focus";
import morph from "@alpinejs/morph";
import persist from "@alpinejs/persist";
import precognition from "laravel-precognition-alpine";
// import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// Call Alpine.
window.Alpine = Alpine;
Alpine.plugin([collapse, focus, morph, persist, precognition]);
Alpine.start();

// // Call Lenis
// // Initializes smooth scrolling with Lenis and integrates it with GSAP's ScrollTrigger.
// // Function to set up smooth scrolling.
// const initSmoothScrolling = () => {
//     // Initialize Lenis for smooth scroll effects. Lerp value controls the smoothness.
//     const lenis = new Lenis({ lerp: 0.2 });

//     // Sync ScrollTrigger with Lenis' scroll updates.
//     lenis.on("scroll", ScrollTrigger.update);

//     // Ensure GSAP animations are in sync with Lenis' scroll frame updates.
//     gsap.ticker.add((time) => {
//         lenis.raf(time * 1000); // Convert GSAP's time to milliseconds for Lenis.
//     });

//     // Turn off GSAP's default lag smoothing to avoid conflicts with Lenis.
//     gsap.ticker.lagSmoothing(0);
// };

// // Activate the smooth scrolling feature.
// initSmoothScrolling();
