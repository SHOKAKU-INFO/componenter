import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppShell from './app/AppShell';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const ComponentLibrary = lazy(() => import('./pages/ComponentLibrary'));
const VisualBuilder = lazy(() => import('./pages/VisualBuilder'));
const Guide = lazy(() => import('./pages/Guide'));
const Settings = lazy(() => import('./pages/Settings'));
const Community = lazy(() => import('./pages/Community'));
const CreateComponent = lazy(() => import('./pages/CreateComponent'));
const UserComponentDetail = lazy(() => import('./pages/UserComponentDetail'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Suspense fallback={<div className="route-loader"/>}><LandingPage /></Suspense>} />
      <Route element={<AppShell />}>
        <Route path="app" element={<Suspense fallback={<div className="route-loader"/>}><Dashboard /></Suspense>} />
        <Route path="components/*" element={<Suspense fallback={<div className="route-loader"/>}><ComponentLibrary /></Suspense>} />
        <Route path="builder" element={<Suspense fallback={<div className="route-loader"/>}><VisualBuilder /></Suspense>} />
        <Route path="guide" element={<Suspense fallback={<div className="route-loader"/>}><Guide /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<div className="route-loader"/>}><Settings /></Suspense>} />
        <Route path="community" element={<Suspense fallback={<div className="route-loader"/>}><Community /></Suspense>} />
        <Route path="create" element={<Suspense fallback={<div className="route-loader"/>}><CreateComponent /></Suspense>} />
        <Route path="components/mine/:id" element={<Suspense fallback={<div className="route-loader"/>}><UserComponentDetail /></Suspense>} />
        <Route path="components/mine/:id/edit" element={<Suspense fallback={<div className="route-loader"/>}><CreateComponent /></Suspense>} />
      </Route>
      <Route path="*" element={<Suspense fallback={<div className="route-loader"/>}><NotFound /></Suspense>} />
    </Routes>
  );
}
