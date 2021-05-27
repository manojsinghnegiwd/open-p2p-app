import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  BrowserRouter,
  Switch,
  Route
} from 'react-router-dom';

import Landing from './views/Landing';

function App() {
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    const userId = uuidv4();
    setCurrentUserId(userId);
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/">
          <Landing currentUserId={currentUserId} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
