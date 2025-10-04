import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

interface BackupConfig {
  databaseUrl: string;
  backupDir: string;
  maxBackups: number;
}

class DatabaseBackup {
  private config: BackupConfig;

  constructor() {
    this.config = {
      databaseUrl: process.env.DATABASE_URL || '',
      backupDir: process.env.BACKUP_DIR || path.join(__dirname, '../../backups'),
      maxBackups: parseInt(process.env.MAX_BACKUPS || '7', 10),
    };

    // Create backup directory if it doesn't exist
    if (!fs.existsSync(this.config.backupDir)) {
      fs.mkdirSync(this.config.backupDir, { recursive: true });
    }
  }

  /**
   * Generate backup filename with timestamp
   */
  private generateBackupFilename(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `backup-${timestamp}.sql`;
  }

  /**
   * Create database backup using pg_dump
   */
  async createBackup(): Promise<string> {
    try {
      const filename = this.generateBackupFilename();
      const filepath = path.join(this.config.backupDir, filename);

      console.log('Creating database backup...');

      // Use pg_dump to create backup
      const command = `pg_dump "${this.config.databaseUrl}" > "${filepath}"`;
      await execAsync(command);

      console.log(`Backup created successfully: ${filepath}`);

      // Compress the backup
      await this.compressBackup(filepath);

      // Clean old backups
      await this.cleanOldBackups();

      return filepath;
    } catch (error) {
      console.error('Backup failed:', error);
      throw error;
    }
  }

  /**
   * Compress backup file using gzip
   */
  private async compressBackup(filepath: string): Promise<void> {
    try {
      console.log('Compressing backup...');
      await execAsync(`gzip "${filepath}"`);
      console.log('Backup compressed successfully');
    } catch (error) {
      console.error('Compression failed:', error);
      throw error;
    }
  }

  /**
   * Remove old backups, keeping only the most recent ones
   */
  private async cleanOldBackups(): Promise<void> {
    try {
      const files = fs.readdirSync(this.config.backupDir);
      const backupFiles = files
        .filter(file => file.startsWith('backup-') && file.endsWith('.sql.gz'))
        .map(file => ({
          name: file,
          path: path.join(this.config.backupDir, file),
          time: fs.statSync(path.join(this.config.backupDir, file)).mtime.getTime(),
        }))
        .sort((a, b) => b.time - a.time);

      // Remove old backups
      if (backupFiles.length > this.config.maxBackups) {
        const filesToDelete = backupFiles.slice(this.config.maxBackups);
        filesToDelete.forEach(file => {
          fs.unlinkSync(file.path);
          console.log(`Deleted old backup: ${file.name}`);
        });
      }
    } catch (error) {
      console.error('Failed to clean old backups:', error);
    }
  }

  /**
   * Restore database from backup
   */
  async restoreBackup(backupFile: string): Promise<void> {
    try {
      console.log(`Restoring database from ${backupFile}...`);

      // Decompress if needed
      let sqlFile = backupFile;
      if (backupFile.endsWith('.gz')) {
        await execAsync(`gunzip -c "${backupFile}" > "${backupFile.replace('.gz', '')}"`);
        sqlFile = backupFile.replace('.gz', '');
      }

      // Restore using psql
      const command = `psql "${this.config.databaseUrl}" < "${sqlFile}"`;
      await execAsync(command);

      console.log('Database restored successfully');

      // Clean up decompressed file
      if (sqlFile !== backupFile) {
        fs.unlinkSync(sqlFile);
      }
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  }

  /**
   * List all available backups
   */
  listBackups(): string[] {
    const files = fs.readdirSync(this.config.backupDir);
    return files
      .filter(file => file.startsWith('backup-') && file.endsWith('.sql.gz'))
      .sort()
      .reverse();
  }
}

// CLI usage
if (require.main === module) {
  const backup = new DatabaseBackup();
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'create':
      backup.createBackup()
        .then(() => {
          console.log('Backup completed successfully');
          process.exit(0);
        })
        .catch(error => {
          console.error('Backup failed:', error);
          process.exit(1);
        });
      break;

    case 'list':
      const backups = backup.listBackups();
      console.log('Available backups:');
      backups.forEach(file => console.log(`  - ${file}`));
      break;

    case 'restore':
      const backupFile = args[1];
      if (!backupFile) {
        console.error('Please provide backup file path');
        process.exit(1);
      }
      backup.restoreBackup(backupFile)
        .then(() => {
          console.log('Restore completed successfully');
          process.exit(0);
        })
        .catch(error => {
          console.error('Restore failed:', error);
          process.exit(1);
        });
      break;

    default:
      console.log('Usage:');
      console.log('  npm run backup:create - Create a new backup');
      console.log('  npm run backup:list - List all backups');
      console.log('  npm run backup:restore <file> - Restore from backup');
      break;
  }
}

export default DatabaseBackup;
