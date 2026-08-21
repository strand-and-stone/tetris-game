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
          Built by <span className={styles.mark}>Strand &amp; Stone</span>
        </p>
        <p className={styles.fine}>
          Harbor Stack is an unofficial fan-made Tetris experience for the browser.
        </p>
      </footer>
    </div>
  );
}
