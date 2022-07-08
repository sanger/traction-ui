/*
  Mock server for testing purposes
  see: https://miragejs.com
  Usage (assuming jest or vitest):
    import { startMirage } from '@tests/_mirage_'
    let mirageServer;

    beforeEach(() => {
      mirageServer = startMirage();
    });

    afterEach(() => {
      mirageServer.shutdown();
    });
*/
import { Server } from 'miragejs'

export function startMirage() {
  return new Server({
    trackRequests: true,
    environment: 'test',

    routes() {
      this.get('/flipper/api/actors/:user', (schema, request) => ({
        flipper_id: request.params.user,
        features: {
          enable_feature: { enabled: true },
          disabled_feature: { enabled: false },
        },
      }))
    },
  })
}
