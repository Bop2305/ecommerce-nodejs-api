const { BadRequestErrorResponse } = require("../core/error.response");

const isDiscountExpired = (endDate) => {
    const currentDate = new Date();

    const discountEndDate = new Date(Date.parse(endDate));

    return currentDate > discountEndDate;
}

const isDiscountNotStarted = (startDate) => {
    const currentDate = new Date();

    const discountStartDate = new Date(Date.parse(startDate));

    return currentDate < discountStartDate;
}

const validateDiscountDates = (discountStartDate, discountEndDate) => {
    const currentDate = new Date();
    const startDate = new Date(Date.parse(discountStartDate));
    const endDate = new Date(Date.parse(discountEndDate));

    if (currentDate > startDate) {
        throw new BadRequestErrorResponse('Invalid start date');
    }

    if (startDate > endDate) {
        throw new BadRequestErrorResponse('Invalid end date');
    }
}

module.exports = {
    isDiscountExpired,
    isDiscountNotStarted,
    validateDiscountDates
}