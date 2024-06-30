import fs from 'fs/promises';
import { CV } from '../types/CV';

export async function readCV(filePath: string): Promise<CV> {
    try {
        const jsonData = await fs.readFile(filePath, 'utf-8');
        const cv: CV = JSON.parse(jsonData);
        return cv;
    } catch (error) {
        console.error(`Error reading CV file: ${error}`);
        throw error;
    }
}