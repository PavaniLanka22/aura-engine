const analyticsService = require("../services/analyticsService");

const getAnalytics = async (req, res) => {
    try {
        const analytics =
            await analyticsService.getAnalytics();

        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        console.error(
            "Analytics error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to generate analytics."
        });
    }
};

module.exports = {
    getAnalytics
};