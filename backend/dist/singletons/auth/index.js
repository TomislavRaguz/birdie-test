"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const authMiddleware = (req, _res, next) => {
    req.getUser = () => ({
        careRecipientIds: [
            'df50cac5-293c-490d-a06c-ee26796f850d',
            'e3e2bff8-d318-4760-beea-841a75f00227',
            'ad3512a6-91b1-4d7d-a005-6f8764dd0111',
        ],
    });
    next();
};
exports.authMiddleware = authMiddleware;
