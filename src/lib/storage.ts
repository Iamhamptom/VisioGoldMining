import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

/**
 * Store a file in the local filesystem.
 * Returns the storage path relative to the uploads directory.
 */
export async function storeFile(
  workspaceId: string,
  repoId: string,
  buffer: Buffer,
  filename: string
): Promise<string> {
  const dir = path.join(UPLOAD_DIR, workspaceId, repoId);
  await ensureDir(dir);

  const storedName = `${uuidv4()}-${filename}`;
  const storagePath = path.join(workspaceId, repoId, storedName);
  const fullPath = path.join(UPLOAD_DIR, storagePath);

  await fs.writeFile(fullPath, buffer);
  return storagePath;
}

/**
 * Read a file from local storage.
 */
export async function readFile(storagePath: string): Promise<Buffer> {
  const fullPath = path.join(UPLOAD_DIR, storagePath);
  return fs.readFile(fullPath);
}

/**
 * Check if a file exists.
 */
export async function fileExists(storagePath: string): Promise<boolean> {
  try {
    const fullPath = path.join(UPLOAD_DIR, storagePath);
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
}
