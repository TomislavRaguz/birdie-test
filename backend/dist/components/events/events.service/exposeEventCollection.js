"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exposeCollection = void 0;
const typeorm_1 = require("typeorm");
const lib_1 = require("../../../lib");
const events_model_1 = require("../events.model");
async function exposeCollection(user, query) {
    if (!user)
        throw new lib_1.RESTError({
            HTTPStatusCode: 401,
            code: 'unauthenticated',
            userMessage: 'You need to be logged in to access events.',
        });
    return exposeListToPrivateUser(user, query);
}
exports.exposeCollection = exposeCollection;
const assertGetListAsPrivateUserQuery = (0, lib_1.createAssert)({
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
async function exposeListToPrivateUser(user, unvalidatedQuery) {
    const query = assertGetListAsPrivateUserQuery(unvalidatedQuery);
    if (!user.careRecipientIds.includes(query.careRecipientId))
        throw new lib_1.RESTError({
            HTTPStatusCode: 403,
            code: 'unauthorized',
            userMessage: 'You don not have the priviledge to access the requested data.',
        });
    let timestampCondition;
    if (query.timeRangeStart || query.timeRangeEnd) {
        timestampCondition = (0, typeorm_1.Raw)((alias) => `${alias} >= :startDate AND ${alias} < :endDate`, {
            startDate: query.timeRangeStart,
            endDate: query.timeRangeEnd || new Date(),
        });
    }
    const findOptions = {
        where: {
            careRecipientId: query.careRecipientId,
            ...(!!query.eventType && { eventType: (0, typeorm_1.In)(query.eventType) }),
            ...(!!timestampCondition && { timestamp: timestampCondition }),
        },
        skip: query.skip ? parseInt(query.skip) : undefined,
        take: query.limit ? parseInt(query.limit) : 20,
        order: { timestamp: 'DESC' },
    };
    const eventsRepository = (0, typeorm_1.getRepository)(events_model_1.Events);
    return eventsRepository.find(findOptions);
}
