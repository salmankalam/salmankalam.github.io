import {
  Nav,
  Hero,
  About,
  Skills,
  Projects,
  Certificates,
  Education,
  Resume,
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
        <Certificates />
        <Education />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
