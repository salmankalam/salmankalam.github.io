import {
  Nav,
  Hero,
  About,
  Skills,
  Projects,
  Education,
  Contact,
  Footer,
} from "./components/sections";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
