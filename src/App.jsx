import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import CheckCarpark from './components/CheckCarpark';
import SearchbyCarparkNumber from './components/SearchbyCarparkNumber';

function App() {
  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Container className="py-5">

        <div style={{ position: 'relative', zIndex: 1 }}>
          <CheckCarpark />
        </div>
      </Container>
    </div>
  );
}

export default App;
