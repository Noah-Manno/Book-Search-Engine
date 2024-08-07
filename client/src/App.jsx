import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import ApolloProviderWrapper from './apolloClient';

function App() {
  return (
    <ApolloProviderWrapper>
      <>
        <Navbar />
        <Outlet />
      </>
    </ApolloProviderWrapper>
  );
}

export default App;
