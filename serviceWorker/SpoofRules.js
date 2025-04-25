static get spoofRules() {
    return [
        {
            pattern: /malicious\.cdn\.com/,
            statusCode: 502,
            message: 'Bad Gateway (Simulated)'
        },
        {
            pattern: /telemetry/,
            statusCode: 408,
            message: 'Request Timeout (Simulated)'
        }
    ];
}

shouldSpoofFailure() {
    const url = this.request.url;
    return RuleService.spoofRules.some(rule => rule.pattern.test(url));
}
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'UPDATE_RULES') {
        RuleService.resourceRules.push(...event.data.rules);
        Utils.log('info', '⏫ Resource rules updated dynamically via drift channel.');
    }
});