"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exposeAggregates = void 0;
const typeorm_1 = require("typeorm");
const lib_1 = require("../../../lib");
const events_model_1 = require("../events.model");
const aggregationFunctions_1 = require("./aggregationFunctions");
async function exposeAggregates(user, query) {
    if (!user)
        throw new lib_1.RESTError({
            HTTPStatusCode: 401,
            code: 'unauthenticated',
            userMessage: 'You need to be logged in to access events.',
        });
    return exposeAggregatesToPrivateUser(user, query);
}
exports.exposeAggregates = exposeAggregates;
const assertExposeAggregatesToPrivateUserQuery = (0, lib_1.createAssert)({
    type: 'object',
    properties: {
        careRecipientId: { type: 'string', format: 'uuid' },
        timeRangeStart: { type: 'string', format: 'date-time', nullable: true },
        timeRangeEnd: { type: 'string', format: 'date-time', nullable: true },
    },
    required: ['careRecipientId'],
});
async function exposeAggregatesToPrivateUser(user, unvalidatedQuery) {
    const query = assertExposeAggregatesToPrivateUserQuery(unvalidatedQuery);
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
            ...(!!timestampCondition && { timestamp: timestampCondition }),
        },
        order: { timestamp: 'DESC' },
    };
    const eventsRepository = (0, typeorm_1.getRepository)(events_model_1.Events);
    const events = await eventsRepository.find(findOptions);
    return {
        byDay: (0, aggregationFunctions_1.aggregateEventValuesByDay)(query, events),
    };
}
