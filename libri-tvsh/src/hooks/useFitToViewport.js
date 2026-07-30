import { useCallback, useEffect, useRef } from "react";

/**
 * E zvogëlon faqen aq sa të nxërë brenda ekranit pa rrëshqitje vertikale —
 * atë që përdoruesi e bënte me dorë nga zoom-i i shfletuesit (67%).
 *
 * Përdor `zoom`, jo `transform: scale()`: `zoom` e rirregullon vërtet faqen,
 * ndaj gjerësitë llogariten vetë dhe modalet e tooltip-at (që dalin jashtë
 * këtij elementi) mbeten në përmasa normale.
 *
 * Vetëm zvogëlon — kurrë nuk e zmadhon faqen mbi 100% — dhe ndalet te
 * `MIN_SCALE`, sepse nën atë kufi shifrat s'lexohen dhe një shirit rrëshqitës
 * është zgjidhje më e mirë se një faqe e palexueshme.
 */
const MIN_SCALE = 0.7;
/* Nën `lg` faqja bëhet një kolonë e vetme dhe rrëshqitja është e natyrshme. */
const MIN_WIDTH = 992;
/* Ndryshimet nën 1% nuk shihen — pa këtë prag matja dhe zvogëlimi do ta
   ushqenin njëra-tjetrën pa pushim. */
const EPSILON = 0.01;

export default function useFitToViewport() {
  const ref = useRef(null);
  const frameRef = useRef(0);

  const fit = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const current = Number(el.style.zoom) || 1;

    if (window.innerWidth < MIN_WIDTH) {
      if (current !== 1) el.style.zoom = "";
      return;
    }

    // Lartësia e faqes ashtu si e sheh syri, e kthyer në përmasa 1:1.
    const natural = el.getBoundingClientRect().height / current;
    if (!natural) return;

    const target = Math.min(1, Math.max(MIN_SCALE, window.innerHeight / natural));
    const rounded = Math.round(target * 100) / 100;
    if (Math.abs(rounded - current) > EPSILON) {
      el.style.zoom = rounded === 1 ? "" : String(rounded);
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const schedule = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(fit);
    };

    schedule();
    const observer = new ResizeObserver(schedule);
    observer.observe(el);
    window.addEventListener("resize", schedule);

    // Fontet vijnë pas ngarkimit dhe e ndryshojnë lartësinë e faqes.
    document.fonts?.ready.then(schedule).catch(() => {});

    return () => {
      cancelAnimationFrame(frameRef.current);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [fit]);

  return ref;
}
