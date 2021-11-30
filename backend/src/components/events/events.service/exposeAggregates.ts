import { FindManyOptions, getRepository, Raw } from 'typeorm';
import { createAssert, RESTError } from '../../../lib';
import { User } from '../../../singletons/auth';
import { Events } from '../events.model';
import { aggregateEventValuesByDay } from './aggregationFunctions';

export async function exposeAggregates(
  user: User | null,
  query: Record<string, any>
) {
  if (!user)
    throw new RESTError({
      HTTPStatusCode: 401,
      code: 'unauthenticated',
      userMessage: 'You need to be logged in to access events.',
    });

  return exposeAggregatesToPrivateUser(user, query);
}

export type EventsAggregateQueryParams = {
  careRecipientId: string;
  timeRangeStart?: string;
  timeRangeEnd?: string;
};

const assertExposeAggregatesToPrivateUserQuery =
  createAssert<EventsAggregateQueryParams>({
    type: 'object',
    properties: {
      careRecipientId: { type: 'string', format: 'uuid' },
      timeRangeStart: { type: 'string', format: 'date-time', nullable: true },
      timeRangeEnd: { type: 'string', format: 'date-time', nullable: true },
    },
    required: ['careRecipientId'],
  });
async function exposeAggregatesToPrivateUser(
  user: User,
  unvalidatedQuery: Record<string, any>
) {
  const query = assertExposeAggregatesToPrivateUserQuery(unvalidatedQuery);

  if (!user.careRecipientIds.includes(query.careRecipientId))
    throw new RESTError({
      HTTPStatusCode: 403,
      code: 'unauthorized',
      userMessage:
        'You don not have the priviledge to access the requested data.',
    });

  let timestampCondition: any;
  if (query.timeRangeStart || query.timeRangeEnd) {
    timestampCondition = Raw(
      (alias) => `${alias} >= :startDate AND ${alias} < :endDate`,
      {
        startDate: query.timeRangeStart,
        endDate: query.timeRangeEnd || new Date(),
      }
    );
  }

  const findOptions: FindManyOptions<Events> = {
    where: {
      careRecipientId: query.careRecipientId,
      ...(!!timestampCondition && { timestamp: timestampCondition }),
    },
    order: { timestamp: 'DESC' },
  };

  const eventsRepository = getRepository(Events);
  const events = await eventsRepository.find(findOptions);

  return {
    byDay: aggregateEventValuesByDay(query, events),
  };
}
