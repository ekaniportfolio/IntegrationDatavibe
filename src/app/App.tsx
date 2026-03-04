import { HashRouter, Routes, Route } from "react-router";
import { ThemeProvider } from "@/app/components/theme-provider";
import { LanguageProvider } from "@/app/components/language-provider";
import { NewPlatform } from "@/app/pages/onboarding/NewPlatform";
import { RMLab } from "@/app/reflex-matrix/RMLab";
import { Toaster } from "sonner";
import "@/styles/theme.css";
import "@/styles/fonts.css";

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <LanguageProvider defaultLanguage="fr">
          <Routes>
            <Route path="/rm-lab" element={<RMLab />} />
            <Route path="*" element={<NewPlatform />} />
          </Routes>
          <Toaster position="top-center" richColors />
        </LanguageProvider>
      </ThemeProvider>
    </HashRouter>
  );
}
