/**
 * Punto de entrada de la aplicación demo-app.
 * Arranca el componente raíz con la configuración de providers (router, HTTP).
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
