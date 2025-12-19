import { Injectable, OnModuleInit } from '@nestjs/common';
import { collectDefaultMetrics, Registry } from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly registry = new Registry();

  get contentType(): string {
    return this.registry.contentType;
  }

  onModuleInit() {
    collectDefaultMetrics({
      register: this.registry,
      prefix: 'livesey_backend_',
    });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
