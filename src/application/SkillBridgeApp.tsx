import { ApplicationRoutes } from './applicationRoutes';
import { ToastContainer } from '../shared/notifications/ToastContainer';

export function SkillBridgeApp() {
  return (
    <>
      <ApplicationRoutes />
      <ToastContainer />
    </>
  );
}
