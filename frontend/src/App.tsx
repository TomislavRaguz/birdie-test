import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import { AlertDialog, alertDialogRef, DesktopNav, InitializationOverlay, LoadingOverlay, loadingOverlayRef, ResponsiveNavbar } from './components';
import { CareRecipientPage } from './pages/CareRecipient';
import { HomePage } from './pages/Home';
import { NotFoundPage } from './pages/NotFound';
import { initialize } from './redux/slices/auth';
import { useAppDispatch } from './redux/store';

function App() {
  const [initialized, setInitialized] = useState(false)
  const dispatch = useAppDispatch();
  async function initializeApp() {
    await dispatch(initialize()).unwrap()
    setInitialized(true)
  }
  useEffect(() => {
    initializeApp()
  }, []);

  return (
    <>
      <ResponsiveNavbar 
        desktopNav={<DesktopNav />}
        mobileNav={<DesktopNav />}
      />

      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route exact path="/care-recipient/:recipientId" component={CareRecipientPage} />

        <Route exact path="*" component={NotFoundPage}/>
      </Switch>

      <LoadingOverlay ref={loadingOverlayRef} />
      <AlertDialog ref={alertDialogRef}/>
      <InitializationOverlay hide={initialized}/>
    </>
  );
}

export default App;
