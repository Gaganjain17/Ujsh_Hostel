import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Redirect to the index.html or any other URL
    window.location.href = 'index1.html';
  }, []);

  return (
    <div>
      Redirecting...
    </div>
  );
}

export default App;