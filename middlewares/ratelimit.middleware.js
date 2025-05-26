import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15mins
    max: 10, // 10 requests per IP
    message: {
        status: 429,
        message: "Too many requests, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
})

export const resetPasswordRateLimit = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 1,
    message: {
        status: 429,
        message: "Too many requests, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
})