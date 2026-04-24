import { Bouquet } from './bouquet/Bouquet';
import { LoadingScreen } from './bouquet/LoadingScreen';
import { useAssetLoader } from './bouquet/useAssetLoader';
import './App.css';

function App() {
  const { progress, done } = useAssetLoader();

  return (
    <main className="app">
      {/* Bouquet renders during loading so it's fully painted underneath
          before the loading screen fades away. */}
      <Bouquet />
      <LoadingScreen progress={progress} done={done} />
    </main>
  );
}

export default App;
