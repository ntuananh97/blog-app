import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { LoginLockedException } from './login-locked.exception';

interface AttemptEntry {
  failCount: number;
  lockedUntil: number; // timestamp ms, 0 = không bị khóa
  lastFailAt: number;
}

@Injectable()
export class LoginAttempService implements OnModuleDestroy {
  private readonly MAX_ATTEMPTS = 3;
  private readonly LOCK_MS = 60_000; // 60 seconds
  private readonly STALE_MS = 15 * 60_000; // bỏ entry không hoạt động quá 15 phút

  private readonly store = new Map<string, AttemptEntry>();
  private readonly cleanupTimer: NodeJS.Timeout;

  constructor() {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, 60_000);
    this.cleanupTimer.unref();
  }

  onModuleDestroy() {
    clearInterval(this.cleanupTimer);
  }

  buildKey(email: string, ip: string): string {
    return `${ip}|${email.trim().toLowerCase()}`;
  }

  assertNotLocked(key: string) {
    const entry = this.store.get(key);
    if (!entry || entry.lockedUntil === 0) return;

    const remainingMs = entry.lockedUntil - Date.now();
    if (remainingMs > 0) {
      throw new LoginLockedException(Math.ceil(remainingMs / 1000));
    }

    // Hết thời gian khóa: đếm lại từ đầu
    this.store.delete(key);
  }

  /** Gọi khi đăng nhập SAI. Sai lần thứ 3 thì khóa và ném 429 luôn. */
  registerFailure(key: string): void {
    const now = Date.now();
    const entry = this.store.get(key) ?? {
      failCount: 0,
      lastFailAt: now,
      lockedUntil: 0,
    };
    entry.failCount++;

    if (entry.failCount > this.MAX_ATTEMPTS) {
      entry.lockedUntil = now + this.LOCK_MS;
      this.store.set(key, entry);
      throw new LoginLockedException(this.LOCK_MS / 1000);
    }

    this.store.set(key, entry);
  }

  resetKey(key: string) {
    this.store.delete(key);
  }

  /** Dọn các entry hết hạn để Map không phình mãi */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, e] of this.store) {
      const lockExpired = e.lockedUntil !== 0 && e.lockedUntil <= now;
      const stale = e.lockedUntil === 0 && now - e.lastFailAt > this.STALE_MS;
      if (lockExpired || stale) this.store.delete(key);
    }
  }
}
