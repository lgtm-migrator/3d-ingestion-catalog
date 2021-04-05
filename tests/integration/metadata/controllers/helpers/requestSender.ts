import * as supertest from 'supertest';
import { Application } from 'express';
import { container } from 'tsyringe';
import { ServerBuilder } from '../../../../../src/serverBuilder';
import { Services } from '../../../../../src/common/constants';
import { IMetadata } from '../../../../../src/metadata/models/metadata';

export function getApp(): Application {
  const builder = container.resolve<ServerBuilder>(ServerBuilder);
  return builder.build();
}

export function getMockedRepoApp(repo: unknown): Application {
  container.register(Services.REPOSITORY, { useValue: repo });
  return getApp();
}

export async function getAll(app: Application): Promise<supertest.Response> {
  return supertest.agent(app).get('/metadata').set('Content-Type', 'application/json');
}

export async function getRecord(app: Application, identifier: string): Promise<supertest.Response> {
  return supertest.agent(app).get(`/metadata/${identifier}`).set('Content-Type', 'application/json');
}

export async function createMetadata(app: Application, payload: IMetadata): Promise<supertest.Response> {
  return supertest.agent(app).post('/metadata').set('Content-Type', 'application/json').send(payload);
}

export async function updateMetadata(app: Application, identifier: string, payload: IMetadata): Promise<supertest.Response> {
  return supertest.agent(app).put(`/metadata/${identifier}`).set('Content-Type', 'application/json').send(payload);
}

export async function deleteMetadata(app: Application, identifier: string): Promise<supertest.Response> {
  return supertest.agent(app).delete(`/metadata/${identifier}`).set('Content-Type', 'application/json');
}
