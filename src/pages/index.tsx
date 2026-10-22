
import scss from '../styles/landingPage.module.scss';

export default function Home() {
  return (
    <div className={scss.appWrapper}>
      <header>
        <nav className={scss.navbar}>
          <h2>My Portfolio</h2>

          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className={scss.main}>
        <section id="home" className={scss.home}>
          <h1>Hello, I'm RJ Mendoza</h1>
          <p>Welcome to my personal portfolio!</p>
        </section>

        <section id="about" className={scss.about}>
          <h2>About Me</h2>
          <p>
            I am an IT graduate majoring in Cybersecurity.
            I enjoy learning programming and creating websites.
          </p>
        </section>

        <section id="skills" className={scss.skills}>
          <h2>My Skills</h2>
          <p>HTML, CSS, JavaScript, PHP, and SQL</p>
        </section>

        <section id="contact" className={scss.contact}>
          <h2>Contact Me</h2>
          <p>Email: your.email@example.com</p>
        </section>
      </main>

      <footer className={scss.footer}>
        <p>© 2026 My Portfolio</p>
      </footer>
    </div>
  );
}
