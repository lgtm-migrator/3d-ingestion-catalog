import * as supertest from 'supertest';
import { Application } from 'express';
import { container } from 'tsyringe';
import { ServerBuilder } from '../../../../../src/serverBuilder';
import { SERVICES } from '../../../../../src/common/constants';
import { IPayload, IUpdatePayload, IUpdateStatus } from '../../../../../src/common/dataModels/records';

export function getApp(): Application {
  const builder = container.resolve<ServerBuilder>(ServerBuilder);
  return builder.build();
}

export function getMockedRepoApp(repo: unknown): Application {
  container.register(SERVICES.METADATA_REPOSITORY, { useValue: repo });
  return getApp();
}

export async function getAll(app: Application): Promise<supertest.Response> {
  return supertest.agent(app).get('/metadata').set('Content-Type', 'application/json');
}

export async function getRecord(app: Application, identifier: string): Promise<supertest.Response> {
  return supertest.agent(app).get(`/metadata/${identifier}`).set('Content-Type', 'application/json');
}

export async function createRecord(app: Application, payload: IPayload): Promise<supertest.Response> {
  return supertest.agent(app).post('/metadata').set('Content-Type', 'application/json').send(payload);
}

// export async function updateRecord(app: Application, identifier: string, payload: IPayload): Promise<supertest.Response> {
//   return supertest.agent(app).put(`/metadata/${identifier}`).set('Content-Type', 'application/json').send(payload);
// }

export async function updatePartialRecord(app: Application, identifier: string, payload: IUpdatePayload): Promise<supertest.Response> {
  return supertest.agent(app).patch(`/metadata/${identifier}`).set('Content-Type', 'application/json').send(payload);
}

export async function deleteRecord(app: Application, identifier: string): Promise<supertest.Response> {
  return supertest.agent(app).delete(`/metadata/${identifier}`).set('Content-Type', 'application/json');
}

export async function publishRecord(app: Application, identifier: string, payload: IUpdateStatus): Promise<supertest.Response> {
  return supertest.agent(app).patch(`/metadata/ChangeStatus/${identifier}`).set('Content-Type', 'application/json').send(payload);
}

export async function findLastVersion(app: Application, identifier: string): Promise<supertest.Response> {
  return supertest.agent(app).get(`/metadata/${identifier}`).set('Content-Type', 'application/json');
}
