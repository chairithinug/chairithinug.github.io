import "/dist/main.css"; // Ensure your CSS is imported
import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  gsap.registerPlugin(ScrollTrigger);
  
  window.addEventListener('DOMContentLoaded', () => {
    gsap.utils.toArray('section').forEach(section => {
      gsap.from(section, {
        y: 0,           // start slightly lower
        opacity: 0,      // fade in
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%", // trigger when section enters viewport
          toggleActions: "play none none reset"
        }
      });
    });
  });