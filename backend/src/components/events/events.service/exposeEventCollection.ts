import { FindManyOptions, getRepository, In, Raw } from 'typeorm';
import { createAssert, RESTError } from '../../../lib';
import { User } from '../../../singletons/auth';
import { Events } from '../events.model';

export async function exposeCollection(
  user: User | null,
  query: Record<string, any>
): Promise<Array<Events>> {
  if (!user)
    throw new RESTError({
      HTTPStatusCode: 401,
      code: 'unauthenticated',
      userMessage: 'You need to be logged in to access events.',
    });

  //we ignore other roles foer simplicity sakes eg
  //getEventsAsCaregiver
  //getEventsAsCareManager
  return exposeListToPrivateUser(user, query);
}

const assertGetListAsPrivateUserQuery = createAssert<{
  careRecipientId: string;
  eventType?: Array<string>;
  skip?: any;
  limit?: any;
  timeRangeStart?: string;
  timeRangeEnd?: string;
}>({
  type: 'object',
  properties: {
    careRecipientId: { type: 'string', format: 'uuid' },
    eventType: { type: 'array', items: { type: 'string' }, nullable: true },
    skip: { type: 'number', nullable: true, minimum: 0 },
    limit: { type: 'number', nullable: true, minimum: 1, maximum: 100 },
    timeRangeStart: { type: 'string', format: 'date-time', nullable: true },
    timeRangeEnd: { type: 'string', format: 'date-time', nullable: true },
  },
  required: ['careRecipientId'],
});
async function exposeListToPrivateUser(
  user: User,
  unvalidatedQuery: Record<string, any>
): Promise<Array<Events>> {
  const query = assertGetListAsPrivateUserQuery(unvalidatedQuery);

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
        startDate: query.timeRangeStart, //"2020-10-06",
        endDate: query.timeRangeEnd || new Date(), // "",
      }
    );
  }

  const findOptions: FindManyOptions<Events> = {
    where: {
      careRecipientId: query.careRecipientId,
      ...(!!query.eventType && { eventType: In(query.eventType) }), //IN
      ...(!!timestampCondition && { timestamp: timestampCondition }),
    },
    skip: query.skip ? parseInt(query.skip) : undefined,
    take: query.limit ? parseInt(query.limit) : 20,
    order: { timestamp: 'DESC' },
  };

  const eventsRepository = getRepository(Events);
  return eventsRepository.find(findOptions);
}
