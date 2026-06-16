import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import SlimaneChat from "./components/slimane/SlimaneChat";
import CompareBar from "./components/ui/CompareBar";

const Home = lazy(() => import("./routes/Home"));
const Orientation = lazy(() => import("./routes/Orientation"));
const Results = lazy(() => import("./routes/Results"));
const Privacy = lazy(() => import("./routes/Privacy"));
const Schools = lazy(() => import("./routes/Schools"));
const SchoolDetail = lazy(() => import("./routes/SchoolDetail"));
const Compare = lazy(() => import("./routes/Compare"));
const Contact = lazy(() => import("./routes/Contact"));

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-navy-400 font-medium">Chargement...</p>
            </div>
          </div>
        }>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/orientation" element={<Orientation />} />
              <Route path="/results/:uuid" element={<Results />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/ecoles" element={<Schools />} />
              <Route path="/ecoles/:slug" element={<SchoolDetail />} />
              <Route path="/comparer" element={<Compare />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
      <SlimaneChat />
      <CompareBar />
    </div>
  );
}

export default App;
