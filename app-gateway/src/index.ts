// index.ts
import * as fs from 'fs/promises';
import { main } from './taskmanager.app';

main().catch(error => {
    console.error('******** FAILED to run the application:', error);
    process.exitCode = 1;
});