import { BaseProcessorData } from '@smarter/shared';
import { logger } from 'logger';

export class ProcessorError extends Error {
  public processorConfig: BaseProcessorData<any>;

  public statusCode: number;

  constructor(msg: string, processorConfig: BaseProcessorData<any>, exception: any = null) {
    super(msg);
    this.processorConfig = processorConfig;
    this.statusCode = exception?.statusCode;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ProcessorError.prototype);
  }

  log() {
    logger.error(`processorId:${this.processorConfig.processorId}, processorName:${this.processorConfig.displayName}. ex:${this.stack}`);
  }
}
