import TetrisGame from "@/components/TetrisGame";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.horizon} />
        <div className={styles.grain} />
      </div>

      <main id="main" className={styles.main}>
        <TetrisGame />
      </main>

      <footer className={styles.footer}>
        <p>
          18+ · Built by <span className={styles.mark}>Strand &amp; Stone</span>
        </p>
        <p className={styles.fine}>
          Edge Stack is an unofficial fan-made Tetris experience. Clear lines. Don&apos;t bust.
        </p>
      </footer>
    </div>
  );
}
