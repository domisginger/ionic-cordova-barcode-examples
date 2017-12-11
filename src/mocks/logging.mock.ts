export class LoggingServiceMock {
    start(): void {
        return;
    }

    log(message, args?): void {
        if(args) {
            console.log(message + ': %j', args);
        } else {
            console.log(message);
        }
        return;
    }

    logError(message, error?) {
        if (error) {
            console.log(message + ': %o', error);
        } else {
            console.log(message);
        }
    }

    sendLogs(): void {
        return;
    }

    showLogs(): void {
        return;
    }

    deleteLogIfTooLarge(): void {
        return;
    }
}