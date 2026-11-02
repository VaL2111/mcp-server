import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { McpService } from './mcp/mcp.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
    abortOnError: false,
  });

  const mcpService = app.get(McpService);
  await mcpService.startStdio();
}

bootstrap().catch((error) => {
  console.error('Fatal error starting MCP server:', error);
  process.exit(1);
});
