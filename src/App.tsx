import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './app/AppShell';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const ComponentLibrary = lazy(() => import('./pages/ComponentLibrary'));
const VisualBuilder = lazy(() => import('./pages/VisualBuilder'));
const Guide = lazy(() => import('./pages/Guide'));
const Settings = lazy(() => import('./pages/Settings'));
const Community = lazy(() => import('./pages/Community'));
const CreateComponent = lazy(() => import('./pages/CreateComponent'));

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Suspense fallback={<div className="route-loader"/>}><Dashboard /></Suspense>} />
        <Route path="components/*" element={<Suspense fallback={<div className="route-loader"/>}><ComponentLibrary /></Suspense>} />
        <Route path="builder" element={<Suspense fallback={<div className="route-loader"/>}><VisualBuilder /></Suspense>} />
        <Route path="guide" element={<Suspense fallback={<div className="route-loader"/>}><Guide /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<div className="route-loader"/>}><Settings /></Suspense>} />
        <Route path="community" element={<Suspense fallback={<div className="route-loader"/>}><Community /></Suspense>} />
        <Route path="create" element={<Suspense fallback={<div className="route-loader"/>}><CreateComponent /></Suspense>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
