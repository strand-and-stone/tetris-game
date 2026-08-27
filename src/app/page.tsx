import TetrisGame from "@/components/TetrisGame";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.horizon} />
        <div className={styles.grain} />
        <div className={styles.graffiti}>
          <span className={styles.g1}>edged</span>
          <span className={styles.g2}>ruined</span>
          <span className={styles.g3}>PNC</span>
          <span className={styles.g4}>leaking</span>
          <span className={styles.g5}>deny</span>
          <span className={styles.g6}>gooncave</span>
        </div>
      </div>

      <main id="main" className={styles.main}>
        <TetrisGame />
      </main>

      <footer className={styles.footer}>
        <p>
          18+ · Built messy by <span className={styles.mark}>Strand &amp; Stone</span>
        </p>
        <p className={styles.fine}>
          Unofficial Tetris for the gooncave. EDGE = hold it. PNC = after the bust. RUIN = finish
          messy. Keys clack. The well gushes. You moan on a good lock.
        </p>
      </footer>
    </div>
  );
}
